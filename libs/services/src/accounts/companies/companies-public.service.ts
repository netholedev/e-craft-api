import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { PublicBaseService } from '@lib/base/abstract/typeorm';
import { ICurrentUser } from '@lib/base/interfaces';
import { CompanyEntity } from '@lib/entities';

import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesPublicService extends PublicBaseService<CompanyEntity> {
  constructor(protected readonly _repository: CompaniesRepository) {
    super(_repository);

    this.insertOne = async (user: ICurrentUser, data: CompanyEntity) => {
      if (!user.subCompanies.includes(data.parent?.id)) {
        data.parent = { id: user.subCompanies[0] } as CompanyEntity;
      }

      return this._repository.insertOne(data);
    };

    this.updateOne = async (
      user: ICurrentUser,
      options: FindConditions<CompanyEntity>,
      partialEntity: QueryDeepPartialEntity<CompanyEntity>,
    ) => {
      try {
        const id = options.id;
        const subCompanies = user.subCompanies;

        const parentFromReq = partialEntity.parent as CompanyEntity;

        if (!subCompanies.includes(id as string)) {
          throw '';
        }

        if (parentFromReq && parentFromReq.id === null) {
          delete options.parent;
        }

        if (parentFromReq && !subCompanies.includes(parentFromReq.id)) {
          throw '';
        }

        return this._repository.updateOne(options, partialEntity);
      } catch (err) {
        return {
          generatedMaps: [],
          raw: [],
          affected: 0,
        };
      }
    };
  }

  async findTrees() {
    return this._repository.findTrees();
  }

  async findAllChildrenTree(user: ICurrentUser, id: string) {
    if (user.subCompanies.includes(id)) {
      const rootCompany = await this._repository.findOne(id, { select: ['name'] });
      const allCompanies = await this._repository.findAllChildrenTree(id);

      allCompanies.name = rootCompany.name;
      return allCompanies;
    }

    return {};
  }

  async findAllChildrenFlat(user: ICurrentUser) {
    return this._repository.findAllChildrenFlat(user.subCompanies[0]);
  }
}
