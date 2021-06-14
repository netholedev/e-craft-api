import { Injectable } from '@nestjs/common';
import { PublicBaseService } from '@lib/base/abstract/typeorm';
import { PermissionEntity } from '@lib/entities';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsPublicService extends PublicBaseService<PermissionEntity> {
  constructor(protected readonly _repository: PermissionsRepository) {
    super(_repository);
  }
}
