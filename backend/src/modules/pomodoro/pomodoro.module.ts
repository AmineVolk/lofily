import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PomodoroService from './pomodoro.service';
import { PomodoroRepository } from './pomodoro.repository';
import { Pomodoro } from './entities/pomodoro.entity';
import { UserModule } from '../user/user.module';
import { PomodoroController } from './pomodoro.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([Pomodoro, PomodoroRepository]),
    UserModule,
  ],
  controllers: [PomodoroController],
  providers: [PomodoroService],
})
export class PomodoroModule {}
