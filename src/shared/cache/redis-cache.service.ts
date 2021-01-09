import * as redis from 'redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CACHE_DURATION = {
  categories: 1 * 60 * 60, // 1 hour
  posts: 5 * 60, // 5 minutes
};

interface CacheService {
  setItem(key: string, durationInSeconds: number, value: any);
  clearCache(): void;
  ping(): Promise<boolean>;
  getFromCache<T>(key: string): Promise<T>;
  getItemOrElse<T>(key: string, durationInSeconds?: number, fetchObject?: () => Promise<T>): Promise<T>;
}

@Injectable()
export class RedisCacheService implements CacheService {

  protected redisClient: redis.RedisClient;
  
  public constructor(private configService: ConfigService) {
    this.redisClient = redis.createClient(
      {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
        retry_strategy: (options: any) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {            
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {            
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            return new Error('Retry attempts exhausted');
          }
          
          // retry
          return Math.min(options.attempt * 100, 3000);
        },
      });
  }

  public async setItem(key: string, durationInSeconds: number, value: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.redisClient.connected) {
        this.redisClient.setex(key, durationInSeconds, JSON.stringify(value), (error) => {
          return error ? reject(error) : resolve();
        });
      }
      return resolve();
    });
  }

  public async getItemOrElse<T>(key: string, durationInSeconds: number, fetchObject?: () => Promise<T>): Promise<T> {
    if (this.redisClient.connected) {     
      if (fetchObject) {
        const value: T = await fetchObject();
        if (!!value) {
          await this.setItem(key, durationInSeconds, value);
        }
        return this.getFromCache<T>(key);
      } 
      const value: T = await this.getFromCache<T>(key);
      return value ? value : undefined;
    }

    return await fetchObject();
  }

  public async getFromCache<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.redisClient.connected) {
        return this.redisClient.get(key, (error: Error, data: string) => {
          return error ? reject(error) : resolve(JSON.parse(data));
        });
      }
      return resolve();
    });
  }

  public clearCache(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.redisClient.connected) {
        this.redisClient.flushall(error => error ? reject(error) : resolve());
      }
      return resolve();
    });
  }

  public ping(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.redisClient.connected) {
        return this.redisClient.ping((error) => {
          return error ? reject(error) : resolve(true);
        });
      }
      return resolve();
    });
  }
}
