import { Role } from '../roles/roles.constants';

export type JWTPayload = {
  sub: number;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  // companyId is undefined for super admins because superAdmins aren't affiliated to any company
  companyId?: number;
  // managedSiteId is only defined for site admins
  managedSiteId?: number;
};

export class BaseUser {
  id: number;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  companyId: number;

  get fullName() {
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

  isSiteOwner() {
    return this.role === Role.SITE_OWNER;
  }

  isMySelf(userId: number) {
    return this.id === userId;
  }

  belongsToCompany(companyId: number) {
    return !!this.companyId && this.companyId === companyId;
  }
}

export class SuperAdmin extends BaseUser {}
export class CompanyAdmin extends BaseUser {}
export class SiteAdmin extends BaseUser {
  managedSiteId: number;

  isSiteAdminSite(siteId: number) {
    return this.managedSiteId === siteId;
  }
}
export class SiteOwner extends BaseUser {}
export type User = SuperAdmin | CompanyAdmin | SiteAdmin | SiteOwner;
