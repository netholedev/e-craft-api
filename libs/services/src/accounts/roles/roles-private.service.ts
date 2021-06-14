import { Injectable } from '@nestjs/common';
import { PrivateBaseService } from '@lib/base/abstract/typeorm';
import { RoleEntity } from '@lib/entities';

import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesPrivateService extends PrivateBaseService<RoleEntity> {
  constructor(protected readonly _repository: RolesRepository) {
    super(_repository);
  }
}
