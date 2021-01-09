import { Module } from '@nestjs/common';
import { RedisCacheService } from '../shared/cache/redis-cache.service';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { PostsRepository } from './repository/posts.repository';
import { PostsService } from './posts.service';
import { LoggerService } from './../shared/services/logger.service';
import { PostsController } from './posts.controller';
import { DB_CONNECTION } from './../database/database.module';
import { PostSchema } from './repository/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'BlogPost',
        useFactory: async (connection: Connection) => {
          const schema = PostSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'postId' });
          return schema;
        },
        inject: [getConnectionToken(DB_CONNECTION)],
      },
    ], DB_CONNECTION),
  ],
  controllers: [PostsController],
  providers: [
    LoggerService,
    PostsService,
    PostsRepository,
    RedisCacheService,
  ],
})
export class PostsModule {}
