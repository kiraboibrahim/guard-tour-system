import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.constants';

// Primary roles are those that are specified at the controller level
export const PRIMARY_ROLES_KEY = 'PRIMARY_ROLES';

// Secondary roles are those that are specified at the handler level
export const SECONDARY_ROLES_KEY = 'SECONDARY_ROLES';

export const DISALLOWED_ROLES_KEY = 'DISALLOWED_ROLES';
export const AllowOnly = (...roles: Role[]) =>
  SetMetadata(PRIMARY_ROLES_KEY, roles);

/**
 *
 * @param roles
 * @returns
 *
 * Extends the specified roles at the controller level with the given roles
 * This decorator should only be used at the handler level
 */
export const AlsoAllow = (...roles: Role[]) =>
  SetMetadata(SECONDARY_ROLES_KEY, roles);

/**
 *
 * @param roles
 * @returns
 *
 * Excludes the given roles from the specified roles at the controller level
 * This decorator should only be used at the handler level
 */
export const DisAllow = (...roles: Role[]) =>
  SetMetadata(DISALLOWED_ROLES_KEY, roles);
