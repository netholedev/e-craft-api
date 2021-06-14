import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import { CategoryEntity } from '@lib/entities';
import { CategoriesPublicService } from '@lib/services';

import { QueryFilter } from '@lib/base/dtos';
import { Auth, CurrentUser } from '@lib/base/decorators';
import { ICurrentUser } from '@lib/base/interfaces';

@Controller('categories')
@Auth()
export class CategoriesController {
  constructor(private readonly categoriesPublicService: CategoriesPublicService) {}

  @Get()
  async find(@Query() query: QueryFilter<CategoryEntity>, @CurrentUser() user: ICurrentUser) {
    return this.categoriesPublicService.findAllChildrenTree(user);
  }

  @Post()
  async create(@Body() data: CategoryEntity, @CurrentUser() user: any) {
    return this.categoriesPublicService.insertOne(user, data);
  }

  @Get(':id')
  async getChildren(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryFilter<CategoryEntity>,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.categoriesPublicService.findOne(user, id, query);
  }

  @Put(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CategoryEntity,
    @CurrentUser() user: any,
  ) {
    return this.categoriesPublicService.updateOne(user, { id }, body);
  }
}
