import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { GaxiosError } from 'gaxios';

@Catch()
export class ErrorHandle implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception, 'Filterdan');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      // TypeORM QueryFailedError uchun maxsus xabar va status kodini o'rnatish
      status = HttpStatus.BAD_REQUEST;
      message = {
        statusCode: status,
        error: 'Database Error',
        message: exception.message,
        detail: exception.driverError.detail,
      };
    } else if (exception instanceof GaxiosError) {
      // GaxiosError uchun maxsus xabar va status kodini o'rnatish
      status = exception.response?.status || HttpStatus.BAD_REQUEST;
      message = {
        statusCode: status,
        error: 'Google API Error',
        message: exception.message,
        detail:
          exception.response?.data?.error?.message ||
          'No additional error details',
      };
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
