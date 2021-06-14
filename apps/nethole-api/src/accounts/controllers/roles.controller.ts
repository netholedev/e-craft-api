import { Controller } from '@nestjs/common';
import { PermissionsPrivateService, RolesPrivateService, RolesPublicService } from '@lib/services';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesPublicService: RolesPublicService,
    private readonly rolesPrivateService: RolesPrivateService,
    private readonly permissionsPrivateService: PermissionsPrivateService,
  ) {}

  /*
  async onApplicationBootstrap() {
    const permissions = await this.permissionsPrivateService.find({ select: ['id'] });
    await this.rolesPrivateService.updateOrInsert(
      { name: 'admin', isDefault: false, company: { id: 'cfbbab64-7a86-4b2e-8473-15924f4e61cb' } },
      { permissions },
    );
  }
  */
}
