import { PomodoroType } from '@/enum';
import { UserModel } from '@/models/User';

export interface FinishedResponseDto {
  nextPomodoroType: PomodoroType;
  user: UserModel;
}
