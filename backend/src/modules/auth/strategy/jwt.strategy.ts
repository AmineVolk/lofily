import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: function (req) {
        let token = null;

        if (req && req.cookies) {
          const access_token = req.cookies['access_token'];

          token = access_token;
        }

        if (
          !token &&
          (req.path === '/background' || req.path === '/background/mobile')
        ) {
          token = req.headers.authorization;
        }

        if (!token && req.path === '/auth/refresh/socialmedia') {
          token = req.body.access_token;
        }

        if (!token && req.path === '/auth/refresh') {
          token = req.cookies['refresh_token'];
        }

        return token;
      },
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload, done: any) {
    try {
      done(null, payload);
    } catch (err) {
      throw new UnauthorizedException('unauthorized', err.message);
    }
  }
}
