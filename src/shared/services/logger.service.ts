import { Logger } from '@nestjs/common';

export interface RequestLog {
  date: string;
  source: string;
  url: string;
  method: string;
  endpoint: string;
  params: string;
  query: string;
  body: string;
}

export interface ResponseLog extends RequestLog {
  status: number;
  duration: number;
  sizeInBytes: number;
}

export interface ErrorLog extends RequestLog {
  status: number;
  errorMessage: string;
}

export class LoggerService extends Logger {
  private logger: Logger = new Logger('');

  public log(service: string, message: string) {
    this.logger.log(`[INFO] ${service} - ${message}`);
  }

  public warn(service: string, message: string) {
    this.logger.warn(`[WARN] ${service} - ${message}`);
  }

  public request(log: RequestLog): void {
    console.log('[REQ]', this.getRequestLog(log));
  }

  public response(log: ResponseLog): void {
    console.log(`[RES] ${this.getRequestLog(log)} [Status] ${log.status} [Duration] ${log.duration}ms [Size] ${log.sizeInBytes}B`);
  }

  public error(log: ErrorLog): void {
    console.log('[ERR]', this.getErrorLog(log));
  }

  private getRequestLog(log: RequestLog | ResponseLog | ErrorLog): string {
    return `[${log.date}] [Method] ${log.method} [Source] ${log.source} [URL] ${log.url} [Endpoint] ${log.endpoint} [Params] ${log.params} [Query] ${log.query} [Body] ${log.body}`;
  }

  private getErrorLog(log: ErrorLog): string {
    return `${this.getRequestLog(log)} [Status] ${log.status} [ErrorMessage] ${log.errorMessage}`;
  }
}