import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(errorMessage: string) {
    super(
      { status: 'BAD_REQUEST', error: errorMessage },
      HttpStatus.BAD_REQUEST,
    );
  }
}
