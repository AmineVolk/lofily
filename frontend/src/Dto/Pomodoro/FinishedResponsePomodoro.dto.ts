import { PomodoroType } from '@/enum';

import { GetUserDto } from '../User/GetUser.dto';

export interface FinishedResponseDto {
  nextPomodoroType: PomodoroType;
  user: GetUserDto;
}
