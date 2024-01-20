import { Role } from '../roles/roles';

export type JWTPayload = {
  sub: number;
  role: Role;
  username: string;
  firstName: string;
  // companyId is undefined for superAdmins because superAdmins aren't affiliated to any company
  companyId?: number;
  managedSiteId?: number;
  // deployedSiteId will be null when a security guard isn't deployed yet
  deployedSiteId?: number | null;
  // shiftId will also be null when a security guard isn't deployed yet
  shiftId?: number | null;
};

export class BaseUser {
  id: number;
  role: Role;
  firstName: string;
  username: string;
  companyId: number;

  isSuperAdmin() {
    return this.role === Role.SUPER_ADMIN;
  }
  isCompanyAdmin() {
    return this.role === Role.COMPANY_ADMIN;
  }
  isSiteAdmin() {
    return this.role === Role.SITE_ADMIN;
  }

  isSecurityGuard() {
    return this.role === Role.SECURITY_GUARD;
  }
  belongsToCompany(companyId: number) {
    return !!this.companyId && this.companyId === companyId;
  }
}

export class SuperAdmin extends BaseUser {}
export class CompanyAdmin extends BaseUser {}
export class SiteAdmin extends BaseUser {
  managedSiteId: number;
}

export class SecurityGuard extends BaseUser {
  shiftId: number;
  deployedSiteId: number;
}

export type User = SuperAdmin | CompanyAdmin | SiteAdmin | SecurityGuard;
