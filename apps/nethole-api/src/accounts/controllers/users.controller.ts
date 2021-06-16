import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { UserEntity } from '@lib/entities';
import { UsersPublicService } from '@lib/services';
import { QueryFilter } from '@lib/base/dtos';
import { Auth, CurrentUser, Filter, Pagination } from '@lib/base/decorators';
import { ICurrentUser } from '@lib/base/interfaces';
import { UuidPipe } from '@lib/base/pipes';
import { ApiTags } from '@nestjs/swagger';

@Auth()
@Controller('users')
@ApiTags('User Management')
export class UsersController {
  constructor(private readonly usersPublicService: UsersPublicService) {}

  @Get()
  find(
    @Query() query: QueryFilter<UserEntity>,
    @CurrentUser() user: ICurrentUser,
    @Pagination() pagination: any, // TODO: interface
  ) {
    return this.usersPublicService.find(user, query);
  }

  @Post()
  create(@Body() data: UserEntity, @CurrentUser() user: ICurrentUser) {
    return this.usersPublicService.insertOne(user, data);
  }

  @Get(':uuid')
  getChildren(
    @Param('uuid', UuidPipe) uuid: string,
    @Query() query: QueryFilter<UserEntity>,
    @CurrentUser() user: ICurrentUser,
  ) {
    if (user.subCompanies.includes(uuid)) {
      return this.usersPublicService.findOne(user, uuid, query);
    }

    return {};
  }

  @Put(':uuid')
  updateById(
    @Param('uuid', UuidPipe) uuid: string,
    @Body() body: UserEntity,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.usersPublicService.updateOne(user, { id: uuid }, body);
  }
}
