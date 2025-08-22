import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log(
      '🔑 JWT Strategy - JWT_SECRET_KEY loaded:',
      !!process.env.JWT_SECRET_KEY,
    );
    console.log(
      '🔑 JWT Strategy - JWT_SECRET_KEY length:',
      process.env.JWT_SECRET_KEY?.length,
    );

    super({
      jwtFromRequest: function (req) {
        console.log('JwtStrategy');
        let token = null;

        if (req && req.cookies) {
          const access_token = req.cookies['access_token'];

          token = access_token;
        }

        if (
          !token &&
          (req.path === '/background' ||
            req.path === '/background/mobile' ||
            req.path === '/music')
        ) {
          console.log(
            '🔍 JWT Strategy - Using header authorization for:',
            req.path,
          );
          token = req.headers.authorization;
          console.log(
            '🔍 JWT Strategy - Header token:',
            token ? token.substring(0, 20) + '...' : 'none',
          );
          console.log('🔍 JWT Strategy - Token assigned:', !!token);
        }

        if (!token && req.path === '/auth/refresh/socialmedia') {
          token = req.body.access_token;
        }

        if (!token && req.path === '/auth/refresh') {
          token = req.cookies['refresh_token'];
        }

        console.log(
          '🔍 JWT Strategy - Final token:',
          token ? 'exists' : 'none',
        );
        return token;
      },
      secretOrKey: process.env.JWT_SECRET_KEY,
      // Debug: vérifier la clé JWT
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    console.log(
      '🔍 JWT Strategy - validate called with payload:',
      payload ? 'exists' : 'none',
    );
    console.log('🔍 JWT Strategy - payload details:', payload);

    try {
      console.log('🔍 JWT Strategy - validation successful');
      return payload;
    } catch (err) {
      console.log('🔍 JWT Strategy - validation failed:', err.message);
      throw new UnauthorizedException('unauthorized', err.message);
    }
  }
}
