import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.types';

export const RequiredRoles = (roles: Role[]) =>
  SetMetadata('requiredRoles', roles);
