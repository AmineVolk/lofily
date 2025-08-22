import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  Logger,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMusicDto } from './dto/update-music.dto';
import { diskStorage } from 'multer';
import { Helper } from 'src/utils/helper';
import { read, update } from 'node-id3';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { join } from 'path';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import {
  MUSIC_FOLDER,
  MUSIC_FOLDER_PATH,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/constants/constants';
import { CreateMusicDto } from './dto/create-music.dto';
import { string, number } from '@hapi/joi';
import { music } from 'faker';

@UseInterceptors(RequestInterceptor)
@Controller('music')
export class MusicController {
  logger = new Logger(MusicController.name);
  constructor(
    private readonly musicService: MusicService,

    @Inject(REQUEST) private request: RequestModel,
  ) {}

  /**
   *
   * @param param0
   * @param file to upload
   * @returns
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const destExists = require('fs').existsSync(MUSIC_FOLDER_PATH);
          if (!destExists) {
            require('fs').mkdirSync(MUSIC_FOLDER_PATH, { recursive: true });
          }
          cb(null, MUSIC_FOLDER_PATH);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  async createMusic(
    @Query()
    { title, artist, duration, duration_text, artist_link },
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('🎵 Music upload endpoint called');
    this.logger.log('🎵 Music upload endpoint called');
    this.logger.log('🔑 Request headers:', this.request.headers);
    this.logger.log(
      '🔑 Authorization header:',
      this.request.headers.authorization,
    );

    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Validate file type
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

    try {
      const filename = file.originalname;
      const filenamePath = MUSIC_FOLDER + filename;
      const filePath = join(MUSIC_FOLDER_PATH, filename);

      // Extraire les métadonnées du fichier
      let metadata: any = {};
      let audioDuration = 0;
      let coverImage = null;

      try {
        metadata = await read(filePath);
        this.logger.log('📊 ID3 Metadata extracted:', {
          title: metadata.title,
          artist: metadata.artist,
          hasImage: !!metadata.image,
          imageType: metadata.image ? typeof metadata.image : 'none',
          imageLength: metadata.image ? metadata.image.length : 0,
          allKeys: Object.keys(metadata),
          imageStructure: metadata.image
            ? {
                type: typeof metadata.image,
                keys: metadata.image ? Object.keys(metadata.image) : [],
                isBuffer: metadata.image
                  ? Buffer.isBuffer(metadata.image)
                  : false,
                constructor: metadata.image
                  ? metadata.image.constructor.name
                  : 'none',
              }
            : 'none',
        });

        // Si node-id3 a trouvé une image, l'utiliser
        if (metadata.picture) {
          coverImage = metadata.picture;
        }
      } catch (metadataError) {
        this.logger.warn(
          '⚠️ Failed to extract ID3 metadata:',
          metadataError.message,
        );
      }

      // Si pas d'image avec node-id3, essayer avec ffmpeg
      if (!coverImage) {
        try {
          coverImage = await this.extractCoverWithFfmpeg(filePath);
          if (coverImage) {
            this.logger.log('🖼️ Cover extracted with ffmpeg');
          }
        } catch (ffmpegError) {
          this.logger.warn(
            '⚠️ Failed to extract cover with ffmpeg:',
            ffmpegError.message,
          );
        }
      }

      // Extraire la durée avec ffprobe
      try {
        audioDuration = await this.getAudioDuration(filePath);
        this.logger.log(
          '⏱️ Audio duration extracted:',
          audioDuration,
          'seconds',
        );
      } catch (durationError) {
        this.logger.warn(
          '⚠️ Failed to extract audio duration:',
          durationError.message,
        );
      }

      // Essayer d'extraire l'image de couverture
      let coverImageUrl = null;

      // 1. Essayer avec node-id3 d'abord
      if (metadata.image) {
        try {
          coverImageUrl = await this.saveCoverImage(metadata.image, filename);
          this.logger.log('🖼️ Cover extracted with node-id3');
        } catch (error) {
          this.logger.warn(
            '⚠️ Failed to save cover with node-id3, trying ffmpeg',
          );
        }
      }

      // 2. Si pas d'image avec node-id3, essayer avec ffmpeg
      if (!coverImageUrl) {
        try {
          const ffmpegCover = await this.extractCoverWithFfmpeg(filePath);
          if (ffmpegCover) {
            coverImageUrl = await this.saveCoverImage(ffmpegCover, filename);
            this.logger.log('🖼️ Cover extracted with ffmpeg');
          }
        } catch (error) {
          this.logger.warn('⚠️ Failed to extract cover with ffmpeg');
        }
      }

      // Préparer les données avec les métadonnées extraites
      const musicToCreate: CreateMusicDto = {
        title: title || metadata.title || file.originalname.split('.')[0],
        artist: artist || metadata.artist || 'Unknown Artist',
        url: filenamePath,
        duration: parseInt(duration) || Math.round(audioDuration || 0),
        duration_text: duration_text || this.formatDuration(audioDuration || 0),
        artist_link: artist_link || null,
        image_url: coverImageUrl,
      };

      const music = await this.musicService.create(musicToCreate);
      this.logger.log('✅ Music created successfully with metadata');
      return music;
    } catch (error) {
      this.logger.error('❌ Error creating music:', error);
      throw new BadRequestException('Failed to create music: ' + error.message);
    }
  }

  /**
   * Formate la durée en format MM:SS
   */
  private formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Sauvegarde l'image de couverture extraite du fichier audio
   */
  private async saveCoverImage(
    picture: any,
    filename: string,
  ): Promise<string> {
    try {
      let imageBuffer: Buffer;

      // node-id3 peut retourner l'image dans différents formats
      if (Buffer.isBuffer(picture)) {
        // Directement un buffer
        imageBuffer = picture;
      } else if (picture && picture.data && Buffer.isBuffer(picture.data)) {
        // Objet avec propriété 'data' qui est un buffer
        imageBuffer = picture.data;
      } else if (
        picture &&
        picture.imageData &&
        Buffer.isBuffer(picture.imageData)
      ) {
        // Autre format possible
        imageBuffer = picture.imageData;
      } else if (
        picture &&
        picture.imageBuffer &&
        Buffer.isBuffer(picture.imageBuffer)
      ) {
        // Format utilisé par node-id3
        imageBuffer = picture.imageBuffer;
      } else {
        throw new Error(
          `Unsupported image format: ${typeof picture}, keys: ${Object.keys(
            picture || {},
          )}`,
        );
      }

      const imageName = `${filename.replace(/\.[^/.]+$/, '')}_cover.jpg`;

      // Sauvegarder dans le dossier thumbnail (comme les backgrounds)
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
   * Extrait l'image de couverture avec ffmpeg
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
              // Nettoyer le fichier temporaire
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

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('sort') sort: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
  ) {
    return this.musicService.findAll(page, limit, sort);
  }

  /**
   * @param id is the id of the music to update
   * @param updateMusicDto
   * @returns
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateMusicDto: UpdateMusicDto,
  ) {
    return this.musicService.update(id, updateMusicDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeById(@Param('id') id: number) {
    this.logger.log(`Remove music with id : ${id}`);
    const music = await this.musicService.findOne(id);

    // Construire la liste des fichiers à supprimer
    const filesToDelete: string[] = [];
    if (music.url) filesToDelete.push(music.url);
    if (music.image_url) filesToDelete.push(music.image_url);

    // Supprimer l'enregistrement et les fichiers
    await this.musicService.removeById(id, filesToDelete);
    return this.musicService.removeMusicFile(music);
  }
}
