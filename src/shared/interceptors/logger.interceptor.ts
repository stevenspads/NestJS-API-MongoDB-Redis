import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService, RequestLog, ResponseLog } from '../services/logger.service';
import { TextEncoder } from 'util';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {

  constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startDate: Date = new Date();
    this.loggerService.request(this.getRequestLog(context, startDate));

    return next
      .handle()
      .pipe(
        tap(res => this.loggerService.response(this.getResponseLog(context, startDate, JSON.stringify(res)))),
      );
  }

  private getRequestLog(context: ExecutionContext, date: Date): RequestLog {
    const requestInfo = context.getArgByIndex(0);
    return {
      date: `${date.toDateString()}, ${date.toTimeString()}`,
      source: requestInfo.headers.host,
      url: requestInfo.url,
      endpoint: requestInfo.route.path,
      params: JSON.stringify(requestInfo.params),
      query: JSON.stringify(requestInfo.query),
      method: requestInfo.method,
      body: JSON.stringify(requestInfo.body),
    };
  }

  private getResponseLog(context: ExecutionContext, startDate: Date, response: string): ResponseLog {
    const requestInfo = context.getArgByIndex(0);
    const endDate: Date = new Date();
    return {
      ...this.getRequestLog(context, startDate),
      date: `${endDate.toDateString()}, ${endDate.toTimeString()}`,
      status: requestInfo.socket._httpMessage.statusCode,
      duration: endDate.valueOf() - startDate.valueOf(),
      sizeInBytes: new TextEncoder().encode(response).length,
    };
  }
}
