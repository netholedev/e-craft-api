import { SetMetadata } from '@nestjs/common';

export const SpesificRoles = (...roles: string[]) => {
  return SetMetadata('roles', roles);
};
