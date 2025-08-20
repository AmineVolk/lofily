import { Provider } from 'src/constants/provider';
import { UserService } from '../../user/user.service';
import { AuthDto } from '../dto/auth-dto';
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response } from 'express';
import { TOKEN_TYPE } from 'src/constants/tokenType';
import { Token } from '../dto/token-dto';
import SocialMediaRefreshDTO from 'src/modules/user/dto/social-media-refresh';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { UserType } from 'src/modules/user/enum/user-type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  getDomainFromUserType(type: string) {
    if (type === UserType.ADMIN) {
      return process.env.BACKOFFICE_URL;
    }
    return process.env.FRONT_URL;
  }

  @Post('/login')
  async login(
    @Body() authDto: AuthDto,
    @Res() response: Response,
    @Headers('origin') origin: string,
  ) {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('---- origin ', origin);
    console.log('---- authDto received:', {
      email: authDto.email,
      password: authDto.password ? '[HIDDEN]' : 'undefined',
    });

    try {
      const userInDb = await this.userService.findUserByEmail(authDto.email);
      console.log(
        '---- userInDb found:',
        userInDb ? `ID: ${userInDb.id}, Type: ${userInDb.type}` : 'NOT_FOUND',
      );

      if (!userInDb) {
        console.log('---- ERROR: User not found');
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      const host = this.getDomainFromUserType(userInDb.type);
      console.log('--- host ', host);

      const authenticated = await this.authService.login(
        authDto.password,
        userInDb.password,
      );
      console.log('---- authentication result:', authenticated);

      if (
        !authenticated ||
        (!userInDb.isEmailConfirmed && userInDb.type !== UserType.ADMIN)
      ) {
        console.log('---- ERROR: Authentication failed or email not confirmed');
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      const tokens = await this.generatedTokens(userInDb.id);
      console.log('---- tokens generated successfully');

      response
        .cookie(
          'access_token',
          tokens.access_token,
          this.cookieOptions(TOKEN_TYPE.ACCESS_TOKEN, host),
        )
        .cookie(
          'refresh_token',
          tokens.refresh_token,
          this.cookieOptions(TOKEN_TYPE.REFRESH_TOKEN, host),
        )
        .send({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });

      console.log('---- LOGIN SUCCESS');
    } catch (error) {
      console.log('---- LOGIN ERROR:', error.message);
      throw error;
    }
  }

  @Post('/refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Res() response: Response) {
    const userInDb = await this.userService.findOne(+this.request.userId);
    const host = this.getDomainFromUserType(userInDb.type);

    if (userInDb) {
      const tokens = await this.generatedTokens(userInDb.id);
      response
        .cookie(
          'access_token',
          tokens.access_token,
          this.cookieOptions(TOKEN_TYPE.ACCESS_TOKEN, host),
        )
        .cookie(
          'refresh_token',
          tokens.refresh_token,
          this.cookieOptions(TOKEN_TYPE.REFRESH_TOKEN, host),
        )
        .send({ success: true });
    }
    return new UnauthorizedException();
  }

  @Get('/logout')
  async logout(@Res() response: Response) {
    if (this.request.userId) {
      const userInDb = await this.userService.findOne(+this.request.userId);
      const host = this.getDomainFromUserType(userInDb.type);

      return response
        .clearCookie(
          'access_token',
          this.cookieOptions(TOKEN_TYPE.ACCESS_TOKEN, host),
        )
        .clearCookie(
          'refresh_token',
          this.cookieOptions(TOKEN_TYPE.ACCESS_TOKEN, host),
        )
        .sendStatus(200);
    }
  }

  public generatedTokens = async (userId: number) => {
    const access_token = await this.authService.getJWT(
      userId,
      Provider.LOCAL,
      TOKEN_TYPE.ACCESS_TOKEN,
    );

    const refresh_token = await this.authService.getJWT(
      userId,
      Provider.LOCAL,
      TOKEN_TYPE.REFRESH_TOKEN,
    );

    const tokens = new Token();
    tokens.access_token = access_token;
    tokens.refresh_token = refresh_token;
    return tokens;
  };

  cookieOptions = (tokenType: TOKEN_TYPE, host: string) => {
    const acccess_token_expiration = Number(
      process.env.ACCESS_TOKEN_EXPIRATION,
    );
    const refresh_token_expiration = Number(
      process.env.REFRESH_TOKEN_EXPIRATION,
    );

    const expiration_date =
      tokenType == TOKEN_TYPE.ACCESS_TOKEN
        ? acccess_token_expiration
        : refresh_token_expiration;

    return {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'dev' ? undefined : host,
      expires: new Date(Date.now() + 1000 * expiration_date),
    };
  };
}
