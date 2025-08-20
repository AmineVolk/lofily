import { AuthDto } from '../dto/auth-dto';
import { Provider } from 'src/constants/provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { TOKEN_TYPE } from 'src/constants/tokenType';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  constructor() {}

  async getJWT(
    thirdPartyId: number,
    provider: Provider,
    tokenType: TOKEN_TYPE,
  ): Promise<string> {
    try {
      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, this.JWT_SECRET_KEY, {
        expiresIn:
          tokenType == TOKEN_TYPE.ACCESS_TOKEN
            ? Number(process.env.ACCESS_TOKEN_EXPIRATION)
            : Number(process.env.REFRESH_TOKEN_EXPIRATION),
      });

      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async login(givenPassword: string, passwordHash: string) {
    return bcrypt.compare(givenPassword, passwordHash);
  }
}
