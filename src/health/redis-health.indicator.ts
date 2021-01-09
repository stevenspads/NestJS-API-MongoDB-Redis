import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RedisCacheService } from './../shared/cache/redis-cache.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {

  constructor(private redisCacheService: RedisCacheService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let status: string;

    try {
      status = await this.redisCacheService.ping() ? 'Connected' : 'Disconnected';
    } catch (error) {
      status = `Error ${error}`;
    }

    const isHealthy: boolean = status === 'Connected';
    const result: HealthIndicatorResult = this.getStatus(key, isHealthy);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Redis health check failed', result);
  }
}
