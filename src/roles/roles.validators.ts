import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SITE_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from './roles.constants';
import { IsIn } from 'class-validator';

export const IsValidRole = () => {
  const valid_roles = [
    SUPER_ADMIN_ROLE,
    COMPANY_ADMIN_ROLE,
    SITE_ADMIN_ROLE,
    SECURITY_GUARD_ROLE,
  ];
  return IsIn(valid_roles);
};
