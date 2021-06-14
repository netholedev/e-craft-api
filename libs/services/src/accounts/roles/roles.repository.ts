import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@lib/base/abstract/typeorm';
import { RoleEntity } from '@lib/entities';

@Injectable()
export class RolesRepository extends BaseRepository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    protected readonly _repository: Repository<RoleEntity>,
  ) {
    super(_repository);
  }
}
