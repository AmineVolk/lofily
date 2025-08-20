import { classToPlain } from 'class-transformer';
import { PomodoroType } from '../enum/pomodoro-type';

export class CreatePomodoroDto {
  id?: number;
  type?: PomodoroType;
  projectid?: string;
  startat?: Date;
  userid?: number;
  toJSON() {
    return classToPlain(this);
  }
}
