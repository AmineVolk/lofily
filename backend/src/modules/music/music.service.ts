import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MUSIC_FOLDER, MUSIC_FOLDER_PATH } from 'src/constants/constants';
import { read, update } from 'node-id3';

import { ConfigService } from '@nestjs/config';
import { CreateMusicDto } from './dto/create-music.dto';
import { Helper } from 'src/utils/helper';
import { Music } from './entities/music.entity';
import { MusicRepository } from './music.repository';
import { UpdateMusicDto } from './dto/update-music.dto';
import { join } from 'path';

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  constructor(
    private musicRepository: MusicRepository,
    private configService: ConfigService,
  ) {}

  private addFullUrl(music: any) {
    const backendUrl =
      this.configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
    return {
      ...music,
      url: `${backendUrl}/${music.url}`,
      image_url: music.image_url ? `${backendUrl}/${music.image_url}` : null,
    };
  }

  private addFullUrlToArray(musics: any[]) {
    return musics.map((music) => this.addFullUrl(music));
  }

  /**
   * Processes music file upload and extracts metadata
   */
  async processMusicUpload(
    file: Express.Multer.File,
    metadata: {
      title?: string;
      artist?: string;
      duration?: string;
      duration_text?: string;
      artist_link?: string;
    },
  ): Promise<Music> {
    this.logger.log('🎵 Processing music upload:', file.originalname);

    // Validate file type
    this.validateAudioFile(file);

    const filename = file.originalname;
    const filenamePath = MUSIC_FOLDER + filename;
    const filePath = join(MUSIC_FOLDER_PATH, filename);

    // Extract file metadata
    const extractedMetadata = await this.extractFileMetadata(filePath);

    // Extract cover image
    const coverImageUrl = await this.extractAndSaveCoverImage(
      filePath,
      filename,
    );

    // Prepare data with extracted metadata
    const musicToCreate: CreateMusicDto = {
      title:
        metadata.title ||
        extractedMetadata.title ||
        file.originalname.split('.')[0],
      artist: metadata.artist || extractedMetadata.artist || 'Unknown Artist',
      url: filenamePath, // Service will add full URL
      duration:
        parseInt(metadata.duration) ||
        Math.round(extractedMetadata.duration || 0),
      duration_text:
        metadata.duration_text ||
        this.formatDuration(extractedMetadata.duration || 0),
      artist_link: metadata.artist_link || null,
      image_url: coverImageUrl,
    };

    const music = await this.create(musicToCreate);
    this.logger.log('✅ Music created successfully with metadata');

    // Return with full URL
    return this.addFullUrl(music);
  }

  /**
   * Validates that the file is a valid audio file
   */
  private validateAudioFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/flac',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only audio files are allowed');
    }
  }

  /**
   * Extracts metadata from an audio file
   */
  private async extractFileMetadata(filePath: string): Promise<{
    title?: string;
    artist?: string;
    duration: number;
  }> {
    let metadata: any = {};
    let audioDuration = 0;

    try {
      metadata = await read(filePath);
      this.logger.log('📋 ID3 metadata extracted successfully');
    } catch (metadataError) {
      this.logger.warn(
        '⚠️ Failed to extract ID3 metadata:',
        metadataError.message,
      );
    }

    // Extract duration with ffprobe
    try {
      audioDuration = await this.getAudioDuration(filePath);
      this.logger.log('⏱️ Audio duration extracted:', audioDuration, 'seconds');
    } catch (durationError) {
      this.logger.warn(
        '⚠️ Failed to extract audio duration:',
        durationError.message,
      );
    }

    return {
      title: metadata.title,
      artist: metadata.artist,
      duration: audioDuration,
    };
  }

  /**
   * Extracts and saves the cover image
   */
  private async extractAndSaveCoverImage(
    filePath: string,
    filename: string,
  ): Promise<string | null> {
    let coverImageUrl = null;

    // 1. Try with node-id3 first
    try {
      const metadata = await read(filePath);
      if ((metadata as any).picture) {
        coverImageUrl = await this.saveCoverImage(
          (metadata as any).picture,
          filename,
        );
        if (coverImageUrl) {
          this.logger.log('🖼️ Cover extracted with node-id3');
          return coverImageUrl;
        }
      }
    } catch (error) {
      this.logger.warn(
        '⚠️ Failed to extract cover with node-id3, trying ffmpeg',
      );
    }

    // 2. If no image with node-id3, try with ffmpeg
    try {
      const ffmpegCover = await this.extractCoverWithFfmpeg(filePath);
      if (ffmpegCover) {
        coverImageUrl = await this.saveCoverImage(ffmpegCover, filename);
        if (coverImageUrl) {
          this.logger.log('🖼️ Cover extracted with ffmpeg');
          return coverImageUrl;
        }
      }
    } catch (error) {
      this.logger.warn('⚠️ Failed to extract cover with ffmpeg');
    }

    return null;
  }

  /**
   * Formats duration in MM:SS format
   */
  private formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Saves the extracted cover image from the audio file
   */
  private async saveCoverImage(
    picture: any,
    filename: string,
  ): Promise<string | null> {
    try {
      let imageBuffer: Buffer;

      // node-id3 can return the image in different formats
      if (Buffer.isBuffer(picture)) {
        // Directly a buffer
        imageBuffer = picture;
      } else if (picture && picture.data && Buffer.isBuffer(picture.data)) {
        // Object with 'data' property which is a buffer
        imageBuffer = picture.data;
      } else if (
        picture &&
        picture.imageData &&
        Buffer.isBuffer(picture.imageData)
      ) {
        // Other possible format
        imageBuffer = picture.imageData;
      } else if (
        picture &&
        picture.imageBuffer &&
        Buffer.isBuffer(picture.imageBuffer)
      ) {
        // Format used by node-id3
        imageBuffer = picture.imageBuffer;
      } else {
        throw new Error(
          `Unsupported image format: ${typeof picture}, keys: ${Object.keys(
            picture || {},
          )}`,
        );
      }

      const imageName = `${filename.replace(/\.[^/.]+$/, '')}_cover.jpg`;

      // Save in the thumbnail folder (like backgrounds)
      const thumbnailDir = join(MUSIC_FOLDER_PATH, '..', 'thumbnail');
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      const imagePath = join(thumbnailDir, imageName);
      await fs.promises.writeFile(imagePath, imageBuffer);

      this.logger.log('🖼️ Cover image saved:', imageName);
      return `thumbnail/${imageName}`;
    } catch (error) {
      this.logger.error('❌ Error saving cover image:', error);
      return null;
    }
  }

  /**
   * Extracts the cover image with ffmpeg
   */
  private async extractCoverWithFfmpeg(
    filePath: string,
  ): Promise<Buffer | null> {
    try {
      const tempCoverPath = join(MUSIC_FOLDER_PATH, 'temp_cover.jpg');

      return new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .output(tempCoverPath)
          .noVideo()
          .on('end', async () => {
            try {
              const imageBuffer = await fs.promises.readFile(tempCoverPath);
              // Clean the temporary file
              await fs.promises.unlink(tempCoverPath);
              resolve(imageBuffer);
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (err) => {
            reject(err);
          })
          .run();
      });
    } catch (error) {
      this.logger.error('❌ Error extracting cover with ffmpeg:', error);
      return null;
    }
  }

  /**
   * Gets the duration of an audio file with ffprobe
   */
  private getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        const duration = metadata.format.duration;
        resolve(duration || 0);
      });
    });
  }

  async create(createMusicDto: CreateMusicDto) {
    return this.musicRepository.save(createMusicDto);
  }

  async findAll(page: number, limit: number, sort: string, random = false) {
    const skip = (page - 1) * limit;

    let query: string;
    if (random) {
      query = `SELECT *, count(*) OVER() AS total 
               FROM music 
               WHERE is_active = true
               ORDER BY RANDOM() 
               LIMIT ${limit} OFFSET ${skip}`;
    } else {
      query = `SELECT *, count(*) OVER() AS total 
               FROM music 
               WHERE is_active = true
               ORDER BY ${sort || 'created'} 
               LIMIT ${limit} OFFSET ${skip}`;
    }

    const musics = await this.musicRepository.query(query);

    const total = musics.length ? musics[0].total : 0;
    const musicsMap = musics.map((musicItem) => {
      delete musicItem.total;
      return musicItem;
    });

    // Add full URLs
    const musicsWithFullUrl = this.addFullUrlToArray(musicsMap);

    return {
      data: musicsWithFullUrl,
      total,
      page,
      limit,
    };
  }

  async getRandomMusic(limit = 1) {
    const musics = await this.musicRepository.query(
      `SELECT * FROM music 
       WHERE is_active = true 
       ORDER BY RANDOM() 
       LIMIT ${limit}`,
    );

    // Add full URLs
    return this.addFullUrlToArray(musics);
  }

  find(condition: any) {
    return this.musicRepository.find({ where: condition });
  }

  findOne(id: number) {
    return this.musicRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    return this.musicRepository.update(id, {
      ...updateMusicDto,
      updated: new Date(),
    });
  }

  async removeById(id: number, paths: string[]) {
    // Delete physical files
    Helper.deleteFiles(paths);

    // Delete the record from the database
    return this.musicRepository.delete(id);
  }

  async removeMusicFile(music: Music) {
    try {
      // Build the full paths of the files to delete
      const filesToDelete: string[] = [];

      // Main audio file
      if (music.url) {
        const audioPath = join(
          MUSIC_FOLDER_PATH,
          music.url.replace('musics/', ''),
        );
        filesToDelete.push(audioPath);
      }

      // Cover image
      if (music.image_url) {
        const coverPath = join(MUSIC_FOLDER_PATH, '..', music.image_url);
        filesToDelete.push(coverPath);
      }

      // Delete physical files
      Helper.deleteFiles(filesToDelete);

      // Update the record (mark as deleted)
      return this.musicRepository.update(music.id, {
        url: null,
        image_url: null,
        is_active: false,
      });
    } catch (error) {
      console.error('Error removing music files:', error);
      throw error;
    }
  }
}
