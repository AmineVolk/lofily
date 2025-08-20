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
} from '@nestjs/common';
import { BackgroundService } from './background.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBackgroundDto } from './dto/update-background.dto';
import { diskStorage } from 'multer';
import { Helper, createThumbnail } from 'src/utils/helper';

import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import {
  BACKGROUND_FOLDER,
  BACKGROUND_FOLDER_PATH,
  DEFAULT_PAGINATION_LIMIT,
  THUMBNAIL_FOLDER_PATH,
  THUMBNAIL_FOLDER_PATH_API,
  THUMBNAIL_FOLDER_PATH_API_MOBILE,
  THUMBNAIL_FOLDER_PATH_MOBILE,
} from 'src/constants/constants';
import { CreateBackgroundDto } from './dto/create-background.dto';

@UseInterceptors(RequestInterceptor)
@Controller('background')
export class BackgroundController {
  logger = new Logger(BackgroundController.name);
  constructor(
    private readonly backgroundService: BackgroundService,

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
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  async createBackground(
    @Query() { category_id, is_default },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filename = category_id + '-' + file.originalname;
    const filenamePath = BACKGROUND_FOLDER + filename;

    const isDefault = Boolean(is_default === 'true');

    const thumbnailFileName =
      category_id + '-' + file.originalname.split('.')[0] + '.png';

    const thumbnailUrl = THUMBNAIL_FOLDER_PATH_API + thumbnailFileName;

    await createThumbnail(
      BACKGROUND_FOLDER_PATH + filename,
      THUMBNAIL_FOLDER_PATH + thumbnailFileName,
    );

    const backgroundToCreate: CreateBackgroundDto = {
      url: filenamePath,
      category_id: parseInt(category_id),
      is_default: isDefault,
      thumbnail: thumbnailUrl,
    };

    const background = await this.backgroundService.create(backgroundToCreate);

    return background;
  }

  /**
   *
   * @param param0
   * @param file to upload
   * @returns
   */
  @Post('/mobile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  async createBackgroundMobile(
    @Query() { category_id, background_id },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filename = category_id + '-' + 'mobile' + '-' + file.originalname;
    const filenamePath = BACKGROUND_FOLDER + filename;

    const thumbnailFileName =
      category_id +
      '-' +
      'mobile' +
      '-' +
      file.originalname.split('.')[0] +
      '.png';

    const thumbnailUrl = THUMBNAIL_FOLDER_PATH_API + thumbnailFileName;

    await createThumbnail(
      BACKGROUND_FOLDER_PATH + filename,
      THUMBNAIL_FOLDER_PATH + thumbnailFileName,
      '500x620',
    );
    await this.backgroundService.update(background_id, {
      url_mobile: filenamePath,
      thumbnail_mobile: thumbnailUrl,
    });

    return { url_mobile: filename };
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
    return this.backgroundService.findAll(page, limit, sort);
  }

  @Get('/default')
  async findCurrentUserBackground() {
    const backgrounds = await this.backgroundService.findDefaultPublic();
    if (backgrounds.length) {
      return backgrounds[0];
    }
    throw new NotFoundException();
  }

  @Get('/thumbnail')
  async generateMissingThumbnail() {
    await this.backgroundService.generateMissingThumbnail();
  }
  @Get('/thumbnail/mobile')
  async generateMissingThumbnailMobile() {
    await this.backgroundService.generateMissingThumbnailMobile();
  }
  /**
   * @param id is the id of the background to update
   * @param updateBackgroundDto
   * @returns
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateBackgroundDto: UpdateBackgroundDto,
  ) {
    return this.backgroundService.update(id, updateBackgroundDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeById(@Param('id') id: number) {
    this.logger.log(`Remove background with id : ${id}`);
    const background = await this.backgroundService.findOne(id);
    await this.backgroundService.removeById(id, [
      background.url,
      background.thumbnail,
      background.thumbnail_mobile,
    ]);
    return this.backgroundService.removeMobileBackground(background);
  }

  @Delete(':id/mobile')
  @UseGuards(JwtAuthGuard)
  async removeMobileById(@Param('id') id: number) {
    const background = await this.backgroundService.findOne(id);

    this.logger.log(`Remove background mobile with id : ${id}`);
    return this.backgroundService.removeMobileBackground(background);
  }
}
