import { Inject, Injectable } from '@nestjs/common';
import { CreatePomodoroDto } from './dto/create-pomodoro.dto';
import { UpdatePomodoroDto } from './dto/update-pomodoro.dto';
import { Pomodoro } from './entities/pomodoro.entity';
import { PomodoroRepository } from './pomodoro.repository';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';

@Injectable()
export default class PomodoroService {
  constructor(
    private pomodoroRepository: PomodoroRepository,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  async save(pomodoro: CreatePomodoroDto): Promise<CreatePomodoroDto> {
    return this.pomodoroRepository.save(pomodoro);
  }

  findOne(id: number) {
    return this.pomodoroRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.pomodoroRepository.delete(id);
  }

  updateById(id: number, updatePomodoroDto: UpdatePomodoroDto) {
    return this.pomodoroRepository.update({ id }, updatePomodoroDto);
  }

  findLastPomodoro(userid: number): Promise<Pomodoro> {
    return this.pomodoroRepository
      .query(
        `
        select * from pomodoro
        where userid = $1 and endat notnull
        order by id desc limit 1
      `,
        [userid],
      )
      .then((result) => {
        return result.length ? result[0] : {};
      });
  }
  async resetPomodoro() {
    const { userId } = this.request;
    await this.pomodoroRepository.query(
      `
        update public.user set current_pomodoro_id=null, nbr_ended_pomodoro=0
        where id=$1;

      `,
      [userId],
    );
    return this.pomodoroRepository.query(
      `
        delete from pomodoro where userid=$1 and startat >  now()::date - 365

      `,
      [userId],
    );
  }
}
