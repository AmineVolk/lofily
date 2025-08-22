import { Module } from '@nestjs/common';
import { Music } from './entities/music.entity';
import { MusicController } from './music.controller';
import { MusicRepository } from './music.repository';
import { MusicService } from './music.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Music, MusicRepository])],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {
  constructor() {
    console.log('🎵 MusicModule loaded');
  }
}
