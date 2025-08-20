import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Inject,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { CreatePomodoroDto } from './dto/create-pomodoro.dto';
import { PomodoroType } from './enum/pomodoro-type';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { UserService } from 'src/modules/user/user.service';
import PomodoroService from './pomodoro.service';
@UseInterceptors(RequestInterceptor)
@Controller()
export class PomodoroController {
  constructor(
    private readonly pomodoroService: PomodoroService,
    private readonly userService: UserService,

    @Inject(REQUEST) private request: RequestModel,
  ) {}

  async getPomodoroType(userid: number) {
    const currentUser = await this.userService.findOne(+userid);
    const { long_break_interval, short_break_duration } =
      currentUser.pomodoro_settings;

    const isLongBreak =
      long_break_interval > 0 &&
      long_break_interval === currentUser.nbr_ended_pomodoro &&
      currentUser.nbr_ended_pomodoro > 0;

    const lastPomodoro = await this.pomodoroService.findLastPomodoro(userid);

    const isFirstPomodoro = !lastPomodoro;

    if (isFirstPomodoro) return PomodoroType.pomodoro;

    const isShortBreak =
      !isLongBreak &&
      short_break_duration > 0 &&
      lastPomodoro.type === PomodoroType.pomodoro;

    if (isShortBreak) return PomodoroType.short_break;
    if (isLongBreak) return PomodoroType.long_break;
    return PomodoroType.pomodoro;
  }

  @Get('/pomodoro/type')
  @UseGuards(JwtAuthGuard)
  async pomodoroType() {
    const userid = this.request.userId;
    return this.getPomodoroType(+userid);
  }

  @Post('/pomodoro/start')
  @UseGuards(JwtAuthGuard)
  async register(@Body() createPomodoroDto: CreatePomodoroDto) {
    const userid = this.request.userId;
    createPomodoroDto.userid = parseInt(userid);
    createPomodoroDto.startat = new Date();
    createPomodoroDto.type = await this.getPomodoroType(+userid);

    const ceatedPomodoro = await this.pomodoroService.save(createPomodoroDto);

    await this.userService.updateById(+userid, {
      current_pomodoro_id: ceatedPomodoro.id,
      updated: new Date(),
    });
    return ceatedPomodoro;
  }

  @Post('/pomodoro/finished')
  @UseGuards(JwtAuthGuard)
  async pomodoroFinished() {
    const userid = this.request.userId;
    const currentUser = await this.userService.findOne(+userid);
    const currentPomodoro = await this.pomodoroService.findOne(
      currentUser.current_pomodoro_id,
    );

    let updateUserBody;
    let nextPomodoroType = '';
    if (currentPomodoro) {
      updateUserBody = {
        current_pomodoro_id: null,
        updated: new Date(),
      } as UpdateUserDto;
      if (
        currentPomodoro.type === PomodoroType.pomodoro &&
        !currentPomodoro.endat
      ) {
        updateUserBody.nbr_ended_pomodoro = currentUser.nbr_ended_pomodoro + 1;
      }

      if (currentPomodoro.type === PomodoroType.long_break) {
        updateUserBody.nbr_ended_pomodoro = 0;
      }

      await this.pomodoroService.updateById(currentPomodoro.id, {
        endat: new Date(),
      });

      await this.userService.updateById(+userid, updateUserBody);
    }
    nextPomodoroType = await this.getPomodoroType(+userid);
    return {
      user: {
        ...currentUser,
        ...updateUserBody,
      },
      nextPomodoroType,
    };
  }

  // used when we update pomodoro settings
  @Post('/pomodoro/reset')
  @UseGuards(JwtAuthGuard)
  async resetUserPomodoro() {
    return this.pomodoroService.resetPomodoro();
  }
}
