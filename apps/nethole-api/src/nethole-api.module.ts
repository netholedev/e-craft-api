import { readFileSync } from 'fs';

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ValidationPipe } from '@lib/base/pipes';
import { HttpExceptionFilter } from '@lib/base/filters';
import { TransformInterceptor } from '@lib/base/interceptors';

import { AccountsModule } from './accounts';
import { CatalogsModule } from './catalogs';
import { UploadModule } from './shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          const file = readFileSync('./.config/config.json', 'utf8');
          return JSON.parse(file) as Record<string, any>;
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          database: configService.get('postgres.database'),
          entities: configService.get('postgres.entities'),
          synchronize: configService.get('postgres.synchronize'),
        };
      },
    }),
    AccountsModule,
    CatalogsModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class NetholeApiModule {}
