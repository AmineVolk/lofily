import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { MusicEffectsService } from './music-effects.service';
import { UpdateMusicEffectDto } from './dto/update-music-effect.dto';
import {
  DEFAULT_PAGINATION_LIMIT,
  EFFECT_FOLDER,
} from 'src/constants/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/utils/helper';

@Controller('music-effects')
export class MusicEffectsController {
  constructor(private readonly musicEffectsService: MusicEffectsService) {}

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
        destination: Helper.destinationPathEffects,
        filename: Helper.customFileNameEffect,
      }),
    }),
  )
  async createEffect(
    @Query() { name },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filename = EFFECT_FOLDER + name + '-' + file.originalname;

    const effect = await this.musicEffectsService.create({
      url: filename,
      name,
    });

    return effect;
  }

  @Get()
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
    return this.musicEffectsService.findAll(page, limit, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicEffectsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMusicEffectDto: UpdateMusicEffectDto,
  ) {
    return this.musicEffectsService.update(+id, updateMusicEffectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicEffectsService.remove(+id);
  }
}
