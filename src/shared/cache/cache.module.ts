import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [],
  providers: [
    // cacheProviders,    
    RedisCacheService,
  ],
  exports: [
    // cacheProviders,
    RedisCacheService,
  ],
})
export class CacheModule { }
