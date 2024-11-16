import { Role } from './roles.constants';
import { IsIn } from 'class-validator';

export const IsValidRole = () => {
  const valid_roles = [
    Role.SUPER_ADMIN,
    Role.COMPANY_ADMIN,
    Role.SITE_ADMIN,
    Role.SECURITY_GUARD,
  ];
  return IsIn(valid_roles);
};
