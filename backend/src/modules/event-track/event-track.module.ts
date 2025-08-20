import { Module } from '@nestjs/common';
import { EventTrackService } from './event-track.service';
import { EventTrackController } from './event-track.controller';
import { EventTrackRespository } from './event-track.repository';
import { EventTrack } from './entities/event-track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([EventTrack, EventTrackRespository]),
  ],
  controllers: [EventTrackController],
  providers: [EventTrackService],
})
export class EventTrackModule {}
