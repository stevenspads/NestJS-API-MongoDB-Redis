import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { ErrorLog, LoggerService } from './../../shared/services/logger.service';
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        const statusCode = exception.code;
        const message =  exception.message;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorInfo = {
          statusCode,
          message,
          timestamp: new Date().toISOString(),
        };

        this.loggerService.error({
          status: statusCode,
          errorMessage: message,
        } as ErrorLog);

        response.status(500).json(errorInfo);
    }
  }
}