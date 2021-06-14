import { Injectable } from '@nestjs/common';
import { PublicBaseService } from '@lib/base/abstract/typeorm';
import { RoleEntity } from '@lib/entities';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesPublicService extends PublicBaseService<RoleEntity> {
  constructor(protected readonly _repository: RolesRepository) {
    super(_repository);
  }
}
