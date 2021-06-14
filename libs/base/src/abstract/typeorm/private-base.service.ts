import { FindConditions, FindManyOptions, FindOneOptions, In, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IGenericRepository } from './base.repository';

type IPrivateGenericService<T> = {
  insertOne(data: T): Promise<T>;
  findOne(id?: string | number, options?: FindOneOptions<T>): Promise<T>;
  find(options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]>;
  updateOne(
    options: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
  updateOrInsert(options: FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T>;
};

export abstract class PrivateBaseService<T> implements IPrivateGenericService<T> {
  constructor(protected readonly _repository: IGenericRepository<T>) {}

  async insertOne(data: T): Promise<T> {
    return this._repository.insertOne(data);
  }

  async find(options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  async findOne(id?: string | number, options?: FindOneOptions<T>): Promise<T> {
    return this._repository.findOne(id, options);
  }

  async updateOne(
    options: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this._repository.updateOne(options, partialEntity);
  }

  async updateOrInsert(
    filter: FindConditions<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const exists = await this._repository.count(filter);

    const data = Object.assign(filter, partialEntity);

    if (exists > 0) {
      await this.updateOne(filter, data);
      return this.findOne(null, partialEntity);
    }

    await this.insertOne(data as T);
    return data as T;
  }
}
