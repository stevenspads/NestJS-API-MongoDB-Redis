import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerService } from './../shared/services/logger.service';
import { HealthController } from './../health/health.controller';
import { RedisHealthIndicator } from './../health/redis-health.indicator';
import { RedisCacheService } from './../shared/cache/redis-cache.service';

@Module({
  imports: [    
    TerminusModule,
  ],
  exports: [],
  controllers: [HealthController],
  providers: [
    LoggerService,
    RedisHealthIndicator,
    RedisCacheService,
  ],
})
export class HealthModule {}
