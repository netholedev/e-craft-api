import { FindConditions, FindManyOptions, FindOneOptions, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IGenericRepository } from './base.repository';
import { ICurrentUser } from '@lib/base/interfaces';

type IPublicGenericService<T> = {
  insertOne(user: ICurrentUser, data: T): Promise<T>;
  findOne(user: ICurrentUser, id?: string | number, options?: FindOneOptions<T>): Promise<T>;
  find(user: ICurrentUser, options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]>;
  updateOne(
    user: ICurrentUser,
    options: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
  updateOrInsert(
    user: ICurrentUser,
    options: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T>;
};

export abstract class PublicBaseService<T> implements IPublicGenericService<T> {
  constructor(protected readonly _repository: IGenericRepository<T>) {}

  public injectSubCompanies(user: ICurrentUser, obj: any) {
    obj = Object.assign(obj, {
      company: In(user.subCompanies),
    });
    return obj;
  }

  async insertOne(user: ICurrentUser, data: T): Promise<T> {
    if (!(data as any).company) {
      data = {
        ...data,
        company: { id: user.subCompanies[0] },
      };
    }
    return this._repository.insertOne(data);
  }

  async find(user: ICurrentUser, options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]> {
    console.log(this.injectSubCompanies(user, options));
    return this._repository.find(this.injectSubCompanies(user, options));
  }

  async findOne(user: ICurrentUser, id?: string | number, options?: FindOneOptions<T>): Promise<T> {
    // TODO: Fix..
    options = Object.assign(options, {
      where: { company: In(user.subCompanies) },
    });

    return this._repository.findOne(id, options);
  }

  async updateOne(
    user: ICurrentUser,
    options: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this._repository.updateOne(this.injectSubCompanies(user, options), partialEntity);
  }

  async updateOrInsert(
    user: ICurrentUser,
    options: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const exists = await this._repository.count(options);

    if (exists) {
      await this.updateOne(user, options, partialEntity);
      return this.findOne(user, null, partialEntity);
    }

    await this.insertOne(user, partialEntity as T);
    return partialEntity as T;
  }
}
