import { Injectable } from '@nestjs/common';
import { AccessControl } from 'accesscontrol';
import permissions, {
  COMPANY_ADMIN_RESOURCE,
  COMPANY_RESOURCE,
  TAG_RESOURCE,
  PATROL_PLAN_RESOURCE,
  SECURITY_GUARD_RESOURCE,
  SHIFT_RESOURCE,
  SITE_ADMIN_RESOURCE,
  SITE_RESOURCE,
} from './permissions';
import { SecurityGuard, SiteAdmin, User } from '../auth/auth.types';
import { SECURITY_GUARD_ROLE, SITE_ADMIN_ROLE } from '../roles/roles.constants';
import { TagService } from '../tag/tag.service';
import { ShiftService } from '../shift/shift.service';
import { UserService } from '../user/services/user.service';
import { PatrolPlanService } from '../patrol-plan/patrol-plan.service';
import { SiteService } from '../site/site.service';

@Injectable()
export class PermissionsService extends AccessControl {
  constructor(
    private tagService: TagService,
    private shiftService: ShiftService,
    private userService: UserService,
    private patrolPlanService: PatrolPlanService,
    private siteService: SiteService,
  ) {
    super(permissions);
  }

  /**
   *
   * @param resource
   * @param resourceId
   * @param user
   * Resource ownership is determined by comparing the company under which the
   * user belongs and that of the resource.  This is effective for users who
   * control all resources under the company(SuperAdmins and CompanyAdmins) but less
   * effective for users who only control just a single object or two in a company.
   * Further checks(ownership of resource by user) have to be done on the resource
   * when retrieved from the database. Such check will be done in the services
   * For the user entities, ownership is also determined by comparing the resourceId(userId)
   * and that of the user(user.id)
   */
  public async userHasAccessToResource(
    user: User,
    resource: string,
    resourceId: string,
  ) {
    if (user.isSuperAdmin()) return true;

    switch (resource) {
      case COMPANY_RESOURCE:
        return this.userHasAccessToCompany(user, +resourceId);
      case TAG_RESOURCE:
        return await this.userHasAccessToTag(user, +resourceId);
      case PATROL_PLAN_RESOURCE:
        return await this.userHasAccessToPatroPlan(user, +resourceId);
      case SHIFT_RESOURCE:
        return await this.userHasAccessToShift(user, +resourceId);
      case SITE_RESOURCE:
        return await this.userHasAccessToSite(user, +resourceId);
      case COMPANY_ADMIN_RESOURCE:
        return this.userHasAccessToCompanyAdmin(user, +resourceId);
      case SITE_ADMIN_RESOURCE:
        return await this.userHasAccessToSiteAdmin(user, +resourceId);
      case SECURITY_GUARD_RESOURCE:
        return await this.userHasAccessToSecurityGuard(user, +resourceId);
      default:
        return false;
    }
  }
  private userHasAccessToCompany(user: User, companyId: number) {
    const { companyId: userCompanyId } = user;
    const companyAdminAccessToCompanyGranted =
      user.isCompanyAdmin() && userCompanyId === companyId;
    return companyAdminAccessToCompanyGranted;
  }
  private async userHasAccessToSite(user: User, siteId: number) {
    const { companyId } = user;
    const siteAdminAccessToSiteGranted =
      user.isSiteAdmin() && siteId === (user as SiteAdmin).managedSiteId;
    const securityGuardAccessToSiteGranted =
      user.isSecurityGuard() &&
      siteId === (user as SecurityGuard).deployedSiteId;
    const companyAdminAccessToSiteGranted =
      user.isCompanyAdmin() &&
      (await this.siteService.siteBelongsToCompany(siteId, companyId));
    return (
      securityGuardAccessToSiteGranted ||
      siteAdminAccessToSiteGranted ||
      companyAdminAccessToSiteGranted
    );
  }

  private async userHasAccessToShift(user: User, shiftId: number) {
    const { companyId } = user;
    const companyAdminAccessToShiftGranted =
      user.isCompanyAdmin() &&
      (await this.shiftService.shiftBelongsToCompany(shiftId, companyId));
    return companyAdminAccessToShiftGranted;
  }
  private async userHasAccessToPatroPlan(user: User, patrolPlanId: number) {
    const { companyId } = user;
    const companyAdminAccessToPatrolPlanGranted =
      user.isCompanyAdmin() &&
      (await this.patrolPlanService.patrolPlanBelongsToCompany(
        patrolPlanId,
        companyId,
      ));
    return companyAdminAccessToPatrolPlanGranted;
  }
  private async userHasAccessToTag(user: User, tagId: number) {
    const { companyId } = user;
    const companyAdminAccessToTagGranted =
      user.isCompanyAdmin() &&
      (await this.tagService.tagBelongsToCompany(tagId, companyId));
    return companyAdminAccessToTagGranted;
  }

  private userHasAccessToCompanyAdmin(user: User, companyAdminId: number) {
    const { id: userId } = user;
    const accessToMyselfGranted = companyAdminId === userId;
    const companyAdminAccessToCompanyAdminGranted =
      user.isCompanyAdmin() && accessToMyselfGranted;
    return companyAdminAccessToCompanyAdminGranted;
  }

  private async userHasAccessToSiteAdmin(user: User, siteAdminId: number) {
    const { id: userId, companyId } = user;
    const accessToMySelfGranted = siteAdminId == userId;
    const companyAdminAccessToSiteAdminGranted =
      user.isCompanyAdmin() &&
      (await this.userService.userBelongsToCompany(
        siteAdminId,
        companyId,
        SITE_ADMIN_ROLE,
      ));
    return accessToMySelfGranted || companyAdminAccessToSiteAdminGranted;
  }
  private async userHasAccessToSecurityGuard(
    user: User,
    securityGuardId: number,
  ) {
    const { companyId, id: userId } = user;
    const accessToMySelfGranted = securityGuardId === userId;
    const companyAdminAccessToSecurityGuardGranted =
      user.isCompanyAdmin() &&
      (await this.userService.userBelongsToCompany(
        securityGuardId,
        companyId,
        SECURITY_GUARD_ROLE,
      ));
    return accessToMySelfGranted || companyAdminAccessToSecurityGuardGranted;
  }
}
