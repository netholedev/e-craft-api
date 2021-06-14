import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { URL } from 'url';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest();

    /*
    const permission = this.reflector.get<{
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    }>('permissions', ctx.getHandler());
    */

    const isSuperAdmin = request.user.isSuperAdmin;

    if (!isSuperAdmin) {
      const currentPermissions = request.user.role.permissions;

      console.log(request.context.config);

      const index = currentPermissions.findIndex(
        ({ path, method }) =>
          request.context.config.url === path && method === request.context.config.method,
      );

      return index > -1;
    }

    return isSuperAdmin;
  }
}
