import { Injectable } from '@nestjs/common';
import { PrivateBaseService } from '@lib/base/abstract/typeorm';
import { PermissionEntity } from '@lib/entities';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsPrivateService extends PrivateBaseService<PermissionEntity> {
  constructor(protected readonly _repository: PermissionsRepository) {
    super(_repository);
  }
}
