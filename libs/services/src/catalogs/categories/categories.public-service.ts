import { Injectable } from '@nestjs/common';
import { PublicBaseService } from '@lib/base/abstract/typeorm';
import { CategoryEntity } from '@lib/entities';
import { ICurrentUser } from '@lib/base/interfaces';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesPublicService extends PublicBaseService<CategoryEntity> {
  constructor(protected readonly _repository: CategoriesRepository) {
    super(_repository);
  }

  async findAllChildrenTree(user: ICurrentUser) {
    const rootCategory = await this._repository.find({
      where: this.injectSubCompanies(user, {}),
      select: ['name', 'id'],
      take: 1,
      order: {
        id: 1,
      },
    });

    const allCategories = await this._repository.findAllChildrenTree(rootCategory[0].id);

    allCategories.name = rootCategory[0].name;
    return allCategories;
  }
}
