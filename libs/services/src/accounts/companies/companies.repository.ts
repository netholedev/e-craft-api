import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@lib/base/abstract/typeorm';
import { CompanyEntity } from '@lib/entities';

@Injectable()
export class CompaniesRepository extends BaseRepository<CompanyEntity> {
  constructor(
    @InjectRepository(CompanyEntity)
    protected readonly _repository: Repository<CompanyEntity>,
  ) {
    super(_repository);
  }

  async findTrees() {
    return this._repository.manager.getTreeRepository(CompanyEntity).findTrees();
  }

  async findAllChildrenFlat(id: string) {
    const parent = new CompanyEntity();
    parent.id = id;

    // https://github.com/typeorm/typeorm/issues/2764
    return this._repository.manager.getTreeRepository(CompanyEntity).findDescendants(parent);
  }

  async findAllChildrenTree(id: string) {
    const parent = new CompanyEntity();
    parent.id = id;

    // https://github.com/typeorm/typeorm/issues/2764
    return this._repository.manager.getTreeRepository(CompanyEntity).findDescendantsTree(parent);
  }
}
