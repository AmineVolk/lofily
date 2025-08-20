import { HttpException, HttpStatus } from '@nestjs/common'

export class NotFoundException extends HttpException {
  constructor(errorMessage: string) {
    super({ status: 'NOT_FOUND', error: errorMessage }, HttpStatus.NOT_FOUND)
  }
}
