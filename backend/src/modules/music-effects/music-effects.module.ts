import { Module } from '@nestjs/common';
import { MusicEffectsService } from './music-effects.service';
import { MusicEffectsController } from './music-effects.controller';
import { MusicEffectRepository } from './music-effects.repository';
import { MusicEffect } from './entities/music-effect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMusicEffectsModule } from '../user-music-effects/user-music-effects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([MusicEffect, MusicEffectRepository]),
    UserMusicEffectsModule,
  ],
  controllers: [MusicEffectsController],
  providers: [MusicEffectsService],
})
export class MusicEffectsModule {}
