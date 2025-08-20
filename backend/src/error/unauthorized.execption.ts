import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(errorMessage: string) {
    const defaultError = 'Email or password invalid';
    super(
      { status: 'NOT_FOUND', error: errorMessage || defaultError },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
