import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@lib/base/abstract/typeorm';
import { CategoryEntity } from '@lib/entities';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    protected readonly _repository: Repository<CategoryEntity>,
  ) {
    super(_repository);
  }

  async findAllChildrenFlat(id: number) {
    const parent = new CategoryEntity();
    parent.id = id;

    // https://github.com/typeorm/typeorm/issues/2764
    return this._repository.manager.getTreeRepository(CategoryEntity).findDescendants(parent);
  }

  async findAllChildrenTree(id: number) {
    const parent = new CategoryEntity();
    parent.id = id;

    // https://github.com/typeorm/typeorm/issues/2764
    return this._repository.manager.getTreeRepository(CategoryEntity).findDescendantsTree(parent);
  }
}
