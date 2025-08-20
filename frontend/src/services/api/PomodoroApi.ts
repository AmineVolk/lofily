import { FinishedResponseDto } from '@/Dto/Pomodoro/FinishedResponsePomodoro.dto';

import { api } from './api';

const start = () => api.post('/pomodoro/start');

const finished = () =>
  api
    .post('/pomodoro/finished')
    .then(({ data }) => data as FinishedResponseDto);

const getPomodorType = () => api.get('/pomodoro/type');

const reset = () => api.post('/pomodoro/reset');

const PomodoroApi = {
  start,
  finished,
  getPomodorType,
  reset,
};
export { PomodoroApi };
