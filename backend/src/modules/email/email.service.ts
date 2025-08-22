import { BadRequestException, Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

import { ConfigService } from '@nestjs/config';
import ContactDTO from './dto/contact.dto';
import { HttpService } from '@nestjs/axios';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException } from 'src/error/notFound.exception';
import { Strings } from 'src/constants/strings';
import { UserService } from '../user/user.service';
import VerificationTokenPayload from '../user/entities/verification-token-payload.interface';

type RecaptchaResponseType = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
};
@Injectable()
export default class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  public sendRegisterEmail(email: string, username: string) {
    const url = this.getVerificationLink(email, 'token');

    return this.mailerService.sendMail({
      to: email,
      subject: Strings.email.registration.subject,
      template: './register',
      context: {
        username: username,
        content1: Strings.email.registration.content1,
        content2: Strings.email.registration.content2,
        url,
        button: Strings.email.registration.button,
      },
    });
  }

  public async sendContact(contactDTO: ContactDTO) {
    return this.mailerService
      .sendMail({
        to: this.configService.get('EMAIL_USER'),
        subject: contactDTO.subject,
        template: './contact',
        context: {
          username: contactDTO.name,
          subject: contactDTO.subject,
          email: contactDTO.email,
          message: contactDTO.message,
        },
      })
      .then(() =>
        console.log(
          'contact message sent successfully to ',
          this.configService.get('EMAIL_USER'),
        ),
      )
      .catch((error) => console.error("can't send contact message", error));
  }

  public async sendNewUserNotificaiton(email: string, username: string) {
    return this.mailerService
      .sendMail({
        to: this.configService.get('EMAIL_USER'),
        subject: 'new user registration',
        template: './new-user',
        context: {
          username: username,
          email: email,
        },
      })
      .then(() =>
        console.log(
          'new user registration message sent successfully to ',
          this.configService.get('EMAIL_USER'),
        ),
      )
      .catch((error) => console.error("can't send contact message", error));
  }

  public async validateRecaptchaToken(token: string) {
    const recaptchaResponse =
      await this.httpService.axiosRef.post<RecaptchaResponseType>(
        `https://www.google.com/recaptcha/api/siteverify?secret=${this.configService.get(
          'RECAPTCHA_SECRET_KEY',
        )}&response=${token}`,
      );
    console.log('recaptchaResponse', recaptchaResponse.data['error-codes']);
    return recaptchaResponse.data.success;
  }

  public async resendRegisterEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    console.log('user', user);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendRegisterEmail(user.email, user.username);
  }

  public sendForgotPasswordEmail(email: string, username: string) {
    const url = this.getVerificationLink(email, 'reset_token');

    return this.mailerService.sendMail({
      to: email,
      subject: Strings.email.forgot_password.subject,
      template: './forgot_password',
      context: {
        username: username,
        content: Strings.email.forgot_password.content,
        url,
        button: Strings.email.forgot_password.button,
      },
    });
  }

  public async confirmUserEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.userService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await verify(
        token,
        this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      );

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException('');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public getVerificationLink(email: string, tokenname: string) {
    const payload: VerificationTokenPayload = { email };

    const token = sign(
      payload,
      this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      {
        expiresIn: `${this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        )}s`,
      },
    );

    return `${this.configService.get('FRONT_URL')}?${tokenname}=${token}`;
  }
}
