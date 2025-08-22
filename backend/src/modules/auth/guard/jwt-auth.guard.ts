import { Injectable, Logger } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: any) {
    this.logger.log(
      '🔒 JwtAuthGuard.canActivate called for path:',
      context.switchToHttp().getRequest().path,
    );
    return super.canActivate(context);
  }
}
