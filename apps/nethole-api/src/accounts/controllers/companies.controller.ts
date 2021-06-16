import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ICurrentUser } from '@lib/base/interfaces';
import { Auth, CurrentUser } from '@lib/base/decorators';
import { UuidPipe } from '@lib/base/pipes';
import { CompanyEntity } from '@lib/entities';
import { CompaniesPublicService } from '@lib/services';
import { ApiTags } from '@nestjs/swagger';

@Auth()
@Controller('companies')
@ApiTags('Company Management')
export class CompaniesController {
  constructor(private readonly companiesPublicService: CompaniesPublicService) {}

  @Get()
  find(@CurrentUser() user: ICurrentUser) {
    return this.companiesPublicService.findAllChildrenTree(user, user.subCompanies[0]);
  }

  @Post()
  create(@Body() body: CompanyEntity, @CurrentUser() user: ICurrentUser) {
    return this.companiesPublicService.insertOne(user, body);
  }

  @Get(':uuid')
  getChildren(@Param('uuid', UuidPipe) uuid: string, @CurrentUser() user: ICurrentUser) {
    return this.companiesPublicService.findAllChildrenTree(user, uuid);
  }

  @Put(':uuid')
  updateById(
    @Param('uuid', UuidPipe) uuid: string,
    @Body() body: CompanyEntity,
    @CurrentUser() user: any,
  ) {
    return this.companiesPublicService.updateOne(user, { id: uuid }, body);
  }
}
