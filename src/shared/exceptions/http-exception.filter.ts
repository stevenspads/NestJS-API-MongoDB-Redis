import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService, ErrorLog } from './../services/logger.service';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const message =  exception.getResponse();

    const errorInfo = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.loggerService.error(this.getErrorLog(request, exception));

    response.status(statusCode).json(errorInfo);
  }

  private getErrorLog(request: Request, exception: HttpException): ErrorLog {
    const date: Date = new Date();
    return {
      date: `${date.toDateString()}, ${date.toTimeString()}`,
      source: request.headers.host,
      url: request.url,
      method: request.method,
      endpoint: request.route.path,
      params: JSON.stringify(request.params),
      query: JSON.stringify(request.query),
      body: JSON.stringify(request.body),
      status: exception.getStatus(),
      errorMessage: JSON.stringify(exception.getResponse()),
    };
  }
}
