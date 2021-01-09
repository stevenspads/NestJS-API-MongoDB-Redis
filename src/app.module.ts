import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.production'],
    }),
    DatabaseModule,
    HealthModule,
    CategoriesModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
