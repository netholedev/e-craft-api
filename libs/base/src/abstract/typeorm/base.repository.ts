import { FindConditions, FindManyOptions, FindOneOptions, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type IGenericRepository<T> = {
  insertOne(data: T): Promise<T>;
  findOne(id?: string | number, options?: FindOneOptions<T>): Promise<T>;
  find(options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]>;
  count(options?: FindManyOptions<T> | FindConditions<T>): Promise<number>;
  updateOne(options: FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
  updateOrInsert(options: FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T>;
};

export abstract class BaseRepository<T> implements IGenericRepository<T> {
  constructor(protected readonly _repository: Repository<T>) {}

  async insertOne(data: T): Promise<T> {
    // https://github.com/typeorm/typeorm/issues/5493
    return this._repository.save(data);
  }

  async findOne(id?: string | number, options?: FindOneOptions<T>): Promise<T> {
    return this._repository.findOne(id, options);
  }

  async find(options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  async count(options?: FindManyOptions<T> | FindConditions<T>): Promise<number> {
    return this._repository.count(options);
  }

  async updateOne(options: FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this._repository.update(options, partialEntity);
  }

  async updateOrInsert(options: FindConditions<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
    const exists = await this._repository.findOne(options);

    if (!exists) {
      await this.updateOne(options, partialEntity);
      return partialEntity as T;
    }

    return this.insertOne(partialEntity as T);
  }

  queryBuilder(): SelectQueryBuilder<T> {
    return this._repository.createQueryBuilder();
  }
}
