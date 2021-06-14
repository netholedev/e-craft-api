import { Injectable } from '@nestjs/common';

import { PrivateBaseService } from '@lib/base/abstract/typeorm';
import { CompanyEntity } from '@lib/entities';

import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesPrivateService extends PrivateBaseService<CompanyEntity> {
  constructor(protected readonly _repository: CompaniesRepository) {
    super(_repository);
  }

  async findTrees() {
    return this._repository.findTrees();
  }

  async findAllChildrenTree(uuid: string) {
    const rootCompany = await this._repository.findOne(uuid, { select: ['name'] });
    const allCompanies = await this._repository.findAllChildrenTree(uuid);

    allCompanies.name = rootCompany.name;
    return allCompanies;
  }

  async findAllChildrenFlat(uuid: string) {
    return this._repository.findAllChildrenFlat(uuid);
  }
}
