import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard } from '../guards';

export function Auth() {
  /*
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  */
  return applyDecorators(
    // SetMetadata('permission', { path, method }),
    UseGuards(JwtAuthGuard, PermissionsGuard),
  );
}
