import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RedisCacheService } from '../shared/cache/redis-cache.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './repository/categories.repository';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { CategorySchema } from './repository/category.schema';
import { DB_CONNECTION } from './../database/database.module';
import { LoggerService } from './../shared/services/logger.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Category',
        useFactory: async (connection: Connection) => {
          const schema = CategorySchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'categoryId' });
          return schema;
        },
        inject: [getConnectionToken(DB_CONNECTION)],
      },
    ], DB_CONNECTION),
  ],
  controllers: [CategoriesController],
  providers: [
    LoggerService,
    CategoriesService,
    CategoriesRepository,
    RedisCacheService,
  ],
})
export class CategoriesModule {}
