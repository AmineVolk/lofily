import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { getFieldFromAccessToken } from 'src/utils/cookies.utils';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;

    this.logger.log(`=== ${method} ${url} ===`);
    this.logger.log('Headers:', headers);
    this.logger.log('Body:', body);

    const refresh_token = request.cookies?.['refresh_token'];
    const access_token = request.cookies?.['access_token'];
    const token = access_token || refresh_token;

    if (token) {
      const userId = getFieldFromAccessToken(token, 'thirdPartyId');
      request.userId = userId;
      this.logger.log('User ID from token:', userId);
    }

    return next.handle().pipe(
      tap((response) => {
        this.logger.log(`=== ${method} ${url} SUCCESS ===`);
        this.logger.log('Response:', response);
      }),
      catchError((error) => {
        this.logger.error(`=== ${method} ${url} ERROR ===`);
        this.logger.error('Error details:', {
          message: error.message,
          status: error.status,
          stack: error.stack,
        });
        return throwError(() => error);
      }),
    );
  }
}
