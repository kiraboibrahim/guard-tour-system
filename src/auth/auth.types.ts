import { Role } from '../roles/roles';

export type JWTPayload = {
  sub: number;
  role: Role;
  username: string;
  firstName: string;
  lastName: string;
  // companyId is undefined for superAdmins because superAdmins aren't affiliated to any company
  companyId?: number;
  // managedSiteId is only defined for super admins
  managedSiteId?: number;
};

export class BaseUser {
  id: number;
  role: Role;
  firstName: string;
  lastName: string;
  username: string;
  companyId: number;

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  isSuperAdmin() {
    return this.role === Role.SUPER_ADMIN;
  }
  isCompanyAdmin() {
    return this.role === Role.COMPANY_ADMIN;
  }
  isSiteAdmin() {
    return this.role === Role.SITE_ADMIN;
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

export type User = SuperAdmin | CompanyAdmin | SiteAdmin;
