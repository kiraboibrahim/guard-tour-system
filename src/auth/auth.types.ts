import { Role } from '../roles/roles.types';
import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SITE_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../roles/roles.constants';

export type JWTPayload = {
  sub: number;
  role: Role;
  username: string;
  firstName: string;
  // companyId is undefined for superAdmins coz superAdmins aren't affiliated to any companies
  companyId?: number;
  managedSiteId?: number;
  // deployedSiteId can be null when security guard isn't deployed yet
  deployedSiteId?: number | null;
  // shiftId can be null when security guard isn't deployed yet
  shiftId?: number | null;
};

export class BaseUser {
  id: number;
  role: Role;
  firstName: string;
  username: string;
  companyId: number;

  isSuperAdmin() {
    return this.role === SUPER_ADMIN_ROLE;
  }
  isCompanyAdmin() {
    return this.role === COMPANY_ADMIN_ROLE;
  }
  isSiteAdmin() {
    return this.role === SITE_ADMIN_ROLE;
  }

  isSecurityGuard() {
    return this.role === SECURITY_GUARD_ROLE;
  }
  belongsToCompany(companyId: number) {
    return this.companyId && this.companyId === companyId;
  }
}

export class SuperAdmin extends BaseUser {}
export class CompanyAdmin extends BaseUser {}
export class SiteAdmin extends BaseUser {
  managedSiteId: number;
}

export class SecurityGuard extends BaseUser {
  deployedSiteId: number;
  shiftId: number;
}

export type User = SuperAdmin | CompanyAdmin | SiteAdmin | SecurityGuard;
