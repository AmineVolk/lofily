import { UserModule } from '../user/user.module';

import { JwtStrategy } from './strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [UserModule],
  exports: [AuthService],
})
export class AuthModule {}
