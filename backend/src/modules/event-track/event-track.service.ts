import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as moment from 'moment';
import { RequestModel } from 'src/overrid/request';
import { getCurrentFormatedDate } from 'src/utils/helper';
import { CreateEventTrackDto } from './dto/create-event-track.dto';
import { UpdateEventTrackDto } from './dto/update-event-track.dto';
import { EventTrackRespository } from './event-track.repository';

@Injectable()
export class EventTrackService {
  constructor(
    private eventTrackRespository: EventTrackRespository,
    @Inject(REQUEST) private request: RequestModel,
  ) {}
  async create(createEventTrackDto: CreateEventTrackDto) {
    const currentDate = getCurrentFormatedDate();
    const dailyEventTrack = await this.eventTrackRespository.findOne({
      where: {
        user_id: parseInt(this.request.userId),
        day: currentDate,
      },
    });

    if (dailyEventTrack) {
      const lastUsedAppDate =
        dailyEventTrack.minute_spent_day_history[
          dailyEventTrack.minute_spent_day_history.length - 1
        ].split('/')[0];

      const currentDate = new Date();

      const diff = moment(currentDate).diff(
        new Date(lastUsedAppDate),
        'minutes',
      );

      if (diff >= createEventTrackDto.minute_spent) {
        const currentMinuteSpent =
          dailyEventTrack.minute_spent + createEventTrackDto.minute_spent;

        return this.eventTrackRespository.update(dailyEventTrack.id, {
          minute_spent: currentMinuteSpent,
          minute_spent_day_history: [
            ...dailyEventTrack.minute_spent_day_history,
            new Date().toISOString() + '/' + currentMinuteSpent,
          ],
        });
      }
    }

    return this.eventTrackRespository.save({
      user_id: parseInt(this.request.userId),
      minute_spent_day_history: [new Date().toISOString() + '/' + 0],
      day: currentDate,
      ...createEventTrackDto,
    });
  }

  findAll() {
    return `This action returns all eventTrack`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventTrack`;
  }

  update(id: number, updateEventTrackDto: UpdateEventTrackDto) {
    return `This action updates a #${id} eventTrack`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventTrack`;
  }
}
