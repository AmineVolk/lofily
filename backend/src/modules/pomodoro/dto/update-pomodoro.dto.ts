import { PartialType } from '@nestjs/mapped-types';
import { PomodoroType } from '../enum/pomodoro-type';
import { CreatePomodoroDto } from './create-pomodoro.dto';

export class UpdatePomodoroDto extends PartialType(CreatePomodoroDto) {
  type?: PomodoroType;
  projectid?: string;
  endat?: Date;
}
