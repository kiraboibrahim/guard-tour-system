import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.types';

export const PRIMARY_ROLES_KEY = 'primaryRoles';
export const SECONDARY_ROLES_KEY = 'secondaryRoles';

export const DISALLOWED_ROLES_KEY = 'disallowedRoles';
export const AllowOnly = (...roles: Role[]) =>
  SetMetadata(PRIMARY_ROLES_KEY, roles);

// This decorator should only be used at the handler level
export const AlsoAllow = (...roles: Role[]) =>
  SetMetadata(SECONDARY_ROLES_KEY, roles);

export const DisAllow = (...roles: Role[]) =>
  SetMetadata(DISALLOWED_ROLES_KEY, roles);
