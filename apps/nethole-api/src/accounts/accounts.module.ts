import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CompanyEntity, PermissionEntity, RoleEntity, UserEntity } from '@lib/entities';
import { JwtStrategy, LocalStrategy } from '@lib/base/strategies';
import { LoggerModule } from '@lib/base/modules';

import {
  PermissionsRepository,
  PermissionsPublicService,
  PermissionsPrivateService,
  RolesPrivateService,
  RolesPublicService,
  RolesRepository,
  CompaniesRepository,
  CompaniesPublicService,
  CompaniesPrivateService,
  UsersRepository,
  UsersPublicService,
  UsersPrivateService,
  AuthPublicService,
} from '@lib/services';
import {
  AuthController,
  CompaniesController,
  RolesController,
  UsersController,
} from './controllers';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expire') },
      }),
    }),
    PassportModule,
    LoggerModule,
    TypeOrmModule.forFeature([PermissionEntity, RoleEntity, CompanyEntity, UserEntity]),
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthPublicService,
    PermissionsRepository,
    PermissionsPublicService,
    PermissionsPrivateService,
    RolesRepository,
    RolesPublicService,
    RolesPrivateService,
    CompaniesRepository,
    CompaniesPublicService,
    CompaniesPrivateService,
    UsersRepository,
    UsersPublicService,
    UsersPrivateService,
  ],
  exports: [
    AuthPublicService,
    PermissionsRepository,
    PermissionsPublicService,
    PermissionsPrivateService,
    RolesRepository,
    RolesPublicService,
    RolesPrivateService,
    CompaniesRepository,
    CompaniesPublicService,
    CompaniesPrivateService,
    UsersRepository,
    UsersPublicService,
    UsersPrivateService,
  ],
  controllers: [AuthController, RolesController, UsersController, CompaniesController],
})
export class AccountsModule {}
