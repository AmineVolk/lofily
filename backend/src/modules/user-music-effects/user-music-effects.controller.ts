import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Put,
  Inject,
} from '@nestjs/common';
import { UserMusicEffectsService } from './user-music-effects.service';
import { CreateUserMusicEffectDto } from './dto/create-user-music-effect.dto';
import { UpdateUserMusicEffectDto } from './dto/update-user-music-effect.dto';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
@UseInterceptors(RequestInterceptor)
@Controller('user-music-effects')
export class UserMusicEffectsController {
  constructor(
    private readonly userMusicEffectsService: UserMusicEffectsService,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  @Post()
  create(@Body() createUserMusicEffectDto: CreateUserMusicEffectDto) {
    const { userId } = this.request;
    createUserMusicEffectDto.user_id = parseInt(userId);
    return this.userMusicEffectsService.create(createUserMusicEffectDto);
  }

  @Get()
  findAll() {
    return this.userMusicEffectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userMusicEffectsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserMusicEffectDto: UpdateUserMusicEffectDto,
  ) {
    return this.userMusicEffectsService.update(+id, updateUserMusicEffectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userMusicEffectsService.remove(+id);
  }
}
