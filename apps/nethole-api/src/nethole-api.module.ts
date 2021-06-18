import { readFileSync } from 'fs';

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';

import { ValidationPipe } from '@lib/base/pipes';
import { HttpExceptionFilter } from '@lib/base/filters';
import { TransformInterceptor } from '@lib/base/interceptors';

import { AccountsModule } from './accounts';
import { CatalogsModule } from './catalogs';
import { UploadsModule } from './uploads';
import {
  CategoryEntity,
  CompanyEntity,
  PermissionEntity,
  ProductEntity,
  RoleEntity,
  UserEntity,
} from '@lib/entities';

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
          entities: [
            CompanyEntity,
            PermissionEntity,
            RoleEntity,
            UserEntity,
            CategoryEntity,
            ProductEntity,
          ],
          synchronize: process.env.NODE_ENV !== 'production' || true,
        };
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'tr-*': 'tr',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: './locales',
      },
    }),
    AccountsModule,
    CatalogsModule,
    UploadsModule,
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
