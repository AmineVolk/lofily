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
  BadRequestException,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMusicDto } from './dto/update-music.dto';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import {
  MUSIC_FOLDER,
  MUSIC_FOLDER_PATH,
  DEFAULT_PAGINATION_LIMIT,
} from 'src/constants/constants';

@UseInterceptors(RequestInterceptor)
@Controller('music')
export class MusicController {
  logger = new Logger(MusicController.name);
  constructor(
    private readonly musicService: MusicService,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  /**
   * Upload and create a new music
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
    metadata: {
      title?: string;
      artist?: string;
      duration?: string;
      duration_text?: string;
      artist_link?: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log('🎵 Music upload endpoint called');

    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const music = await this.musicService.processMusicUpload(file, metadata);
      return music;
    } catch (error) {
      this.logger.error('❌ Error creating music:', error);
      throw new BadRequestException('Failed to create music: ' + error.message);
    }
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
    @Query('random') random: string,
  ) {
    const isRandom = random === 'true';
    return this.musicService.findAll(page, limit, sort, isRandom);
  }

  @Get('random')
  @UseGuards(JwtAuthGuard)
  getRandomMusic(
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ) {
    return this.musicService.getRandomMusic(limit);
  }

  /**
   * Update a music
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateMusicDto: UpdateMusicDto,
  ) {
    return this.musicService.update(id, updateMusicDto);
  }

  /**
   * Delete a music
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeById(@Param('id') id: number) {
    this.logger.log(`Remove music with id : ${id}`);
    const music = await this.musicService.findOne(id);

    // Build the list of files to delete
    const filesToDelete: string[] = [];
    if (music.url) filesToDelete.push(music.url);
    if (music.image_url) filesToDelete.push(music.image_url);

    // Delete the record and files
    await this.musicService.removeById(id, filesToDelete);
    return this.musicService.removeMusicFile(music);
  }
}
