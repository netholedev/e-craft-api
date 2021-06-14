import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@lib/base/abstract/typeorm';
import { PermissionEntity } from '@lib/entities';

@Injectable()
export class PermissionsRepository extends BaseRepository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    protected readonly _repository: Repository<PermissionEntity>,
  ) {
    super(_repository);
  }
}
