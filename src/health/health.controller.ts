import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { DNSHealthIndicator, HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { DB_CONNECTION } from './../database/database.module';
import { Connection } from 'mongoose';
import { LoggerInterceptor } from './../shared/interceptors/logger.interceptor';
import { RedisHealthIndicator } from './redis-health.indicator';

@Controller('health')
export class HealthController {
  
  constructor(
    private configService: ConfigService,
    private health: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,    
    @InjectConnection(DB_CONNECTION) private readonly connection: Connection,
    private redisHealthIndicator: RedisHealthIndicator,
    private dns: DNSHealthIndicator) {}

  @Get()
  @HealthCheck()
  @UseInterceptors(LoggerInterceptor)  
  async check()  {
    return this.health.check([      
      () => this.dns.pingCheck('swagger', this.configService.get<string>('SWAGGER_URI')),
      () => this.mongooseHealth.pingCheck('mongoose', { connection: this.connection }),
      () => this.redisHealthIndicator.isHealthy('redis'),
    ]);
  }
}
