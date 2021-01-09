import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const DB_CONNECTION = 'BlogDB';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        useFindAndModify: false,
      }),
      inject: [ConfigService],
      connectionName: DB_CONNECTION,
    }),
  ],
  controllers: [],
  providers: [
    ConfigService,
  ],
  exports: [],

})
export class DatabaseModule { }
