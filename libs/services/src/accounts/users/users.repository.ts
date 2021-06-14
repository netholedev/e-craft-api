import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@lib/entities';
import { BaseRepository } from '@lib/base/abstract/typeorm';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly _repository: Repository<UserEntity>,
  ) {
    super(_repository);
  }
}
