import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { EventTrackService } from './event-track.service';
import { CreateEventTrackDto } from './dto/create-event-track.dto';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseInterceptors(RequestInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('event-track')
export class EventTrackController {
  constructor(private readonly eventTrackService: EventTrackService) {}

  @Post()
  create(@Body() createEventTrackDto: CreateEventTrackDto) {
    return this.eventTrackService.create(createEventTrackDto);
  }

  @Get('/')
  getEvents() {
    return this.eventTrackService.findAll();
  }
}
