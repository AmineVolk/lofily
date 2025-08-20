import {
  Body,
  ConflictException,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import { DEFAULT_PAGINATION_LIMIT } from 'src/constants/constants';
import { BadRequestException } from 'src/error/badRequest.exception';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import EmailService from 'src/modules/email/email.service';
import { RequestModel } from 'src/overrid/request';
import { CreateUserDto } from './dto/create-user.dto';
import ForgotPassword from './dto/forgot-password.dto';
import ResetPasswordDTO from './dto/reset-password.dto';
import UpdateUserPasswordDto from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from './enum/user-type';
import { UserService } from './user.service';
const tmp = require('tmp');

@UseInterceptors(RequestInterceptor)
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException();
    }

    const user = await this.userService.findUserByUsername(
      createUserDto.username,
    )?.[0];

    if (user) {
      throw new BadRequestException(
        'User with username : ' + createUserDto.username + ' already exists',
      );
    }

    const createdUser = this.userService.save(createUserDto);
    await this.emailService.sendRegisterEmail(
      createUserDto.email,
      createUserDto.username,
    );

    // email sent to the lofily.com Admin
    await this.emailService.sendNewUserNotificaiton(
      createUserDto.email,
      createUserDto.username,
    );
    return createdUser;
  }

  @Get('/users/stats')
  @UseGuards(JwtAuthGuard)
  getUsersStats() {
    return this.userService.getStats();
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('sort') sort: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
  ) {
    return this.userService.getUsers(page, limit, sort);
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findUserAndBackground(+id);
  }

  @Get('/user/:id/stats')
  @UseGuards(JwtAuthGuard)
  getUserStats(@Param('id') id: string) {
    return this.userService.getUserStats(+id);
  }

  @Get('/user/export/excel')
  @Header('Content-Type', 'text/xlsx')
  @UseGuards(JwtAuthGuard)
  async exportUsersXls(@Res() res: Response) {
    const allUsers = await this.userService.getUsersToExport();
    if (!allUsers.length) {
      throw new NotFoundException('No users');
    }
    console.log('exportUsersXls, users ', allUsers);

    const rows = [];
    allUsers.forEach((element) => {
      rows.push(Object.values(element));
    });

    const book = new Workbook();
    const sheet = book.addWorksheet('Lofily users');

    // header
    rows.unshift(Object.keys(allUsers[0]));
    sheet.addRows(rows);

    const file = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: 'lofilyUsersExcel',
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        (err, file) => {
          if (err) throw new BadRequestException(err.message);

          book.xlsx
            .writeFile(file)
            .then((_) => {
              resolve(file);
            })
            .catch((err) => {
              throw new BadRequestException(err);
            });
        },
      );
    });

    res.setHeader('Content-Type', 'text/xlsx');

    return res.download(file.toString());
  }

  @Get('/user-me')
  @UseGuards(JwtAuthGuard)
  async me() {
    const id = this.request.userId;
    let user = await this.userService.findUserAndBackground(+id);
    const shouldCheckUserSubscription =
      (Object.keys(user.subscription_infos).length > 0 ||
        user.type === UserType.PREMIUM) &&
      !user.subscription_infos.is_forced_by_admin;

    if (shouldCheckUserSubscription) {
      const subscription_status = await this.userService.getSubscriptionStatus(
        user,
      );
      if (subscription_status !== 'active') {
        console.log(
          '__subscription_status is inactive : ',
          subscription_status,
        );

        user = await this.userService.updateById(+id, {
          subscription_infos: {},
          type: UserType.FREEMIUM,
          updated: new Date(),
        });
      }
    }
    return user;
  }

  @Delete('/user/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Put('/user/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateById(+id, updateUserDto);
    return this.userService.findUserAndBackground(+id);
  }

  @Post('/password/forgot')
  async forgotPassword(@Body() forgotPassword: ForgotPassword) {
    const user = await this.userService.findUserByEmail(forgotPassword.email);
    if (user) {
      return this.emailService.sendForgotPasswordEmail(
        forgotPassword.email,
        user.username,
      );
    }
  }

  @Post('/password/reset')
  async passwordReset(@Body() resetPasswordDTO: ResetPasswordDTO) {
    const email = await this.emailService.decodeConfirmationToken(
      resetPasswordDTO.token,
    );
    return this.userService.resetPassword(email, resetPasswordDTO.newPassword);
  }

  @Put('/password')
  async updateUserPassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPassword(updateUserPasswordDto);
  }
}
