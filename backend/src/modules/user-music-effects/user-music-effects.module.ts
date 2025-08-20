import { Module } from '@nestjs/common';
import { UserMusicEffectsService } from './user-music-effects.service';
import { UserMusicEffectsController } from './user-music-effects.controller';
import { UserMusicEffectRepository } from './user-music-effects.repository';
import { UserMusicEffect } from './entities/user-music-effect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEffectsModule } from '../music-effects/music-effects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([UserMusicEffect, UserMusicEffectRepository]),
  ],
  controllers: [UserMusicEffectsController],
  providers: [UserMusicEffectsService],
  exports: [UserMusicEffectsService],
})
export class UserMusicEffectsModule {}
