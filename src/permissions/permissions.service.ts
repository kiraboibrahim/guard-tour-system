import { ForbiddenException, Injectable } from '@nestjs/common';
import { Resource } from './permissions';
import { User } from '../auth/auth.types';
import { Role } from '../roles/roles';
import { CreateSiteAdminDto } from '../user/dto/create-site-admin.dto';
import { Site } from '../site/entities/site.entity';
import { CreateSecurityGuardDto } from '../user/dto/create-security-guard.dto';
import { CreateSiteDto } from '../site/dto/create-site.dto';
import { CreateTagsDto } from '../tag/dto/create-tags.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { CompanyAdmin } from '../user/entities/company-admin.entity';
import { SiteAdmin } from '../user/entities/site-admin.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { UpdateSiteAdminDto } from '../user/dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../user/dto/update-security-guard.dto';
import { UpdateTagUIDDto } from '../tag/dto/update-tag-uid.dto';
import { CreateDto, UpdateDto } from './permissions.types';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { CreateCompanyAdminDto } from '../user/dto/create-company-admin.dto';
import { UpdateCompanyDto } from '../company/dto/update-company.dto';
import { UpdateCompanyAdminDto } from '../user/dto/update-company-admin.dto';
import { CreateSuperAdminDto } from '../user/dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../user/dto/update-super-admin.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { isArray, isString } from 'class-validator';
import { CreatePatrolDto } from '../patrol/dto/create-patrol.dto';
import { TagsActionDto } from '../tag/dto/tags-action.dto';
import { INSTALL_TAGS_ACTION } from '../tag/tag.constants';
import { UpdateSiteDto } from '../site/dto/update-site.dto';
import { LOCALHOST_REGEX } from '../core/core.constants';

// TODO: Modify methods to throw exceptions instead of returning boolean values for permission checks
@Injectable()
export class PermissionsService {
  private user: User;
  private request: any;
  private resource: Resource;

  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  setRequest(request: any) {
    this.request = request;
  }

  can(user: User): PermissionsService {
    this.user = user;
    return this;
  }

  // Determine if the user can create a given resource(s).
  async create(
    resource: Resource,
    createDto: CreateDto,
    { throwError = false } = {},
  ) {
    this.handleUndefinedUser();
    const canCreateResource = await this.handleCreatePermissions(
      resource,
      createDto,
    );
    if (!canCreateResource && throwError) throw new ForbiddenException();
    return canCreateResource;
  }

  private async handleCreatePermissions(
    resource: Resource,
    createDto: CreateDto,
  ) {
    switch (resource) {
      case Resource.SUPER_ADMIN:
        return this.canUserCreateSuperAdmin(createDto as CreateSuperAdminDto);
      case Resource.COMPANY:
        return this.canUserCreateCompany(createDto as CreateCompanyDto);
      case Resource.COMPANY_ADMIN:
        return this.canUserCreateCompanyAdmin(
          createDto as CreateCompanyAdminDto,
        );
      case Resource.SITE_ADMIN:
        return this.canUserCreateSiteAdmin(createDto as CreateSiteAdminDto);
      case Resource.SECURITY_GUARD:
        return this.canUserCreateSecurityGuard(
          createDto as CreateSecurityGuardDto,
        );
      case Resource.SITE:
        return this.canUserCreateSite(createDto as CreateSiteDto);
      case Resource.TAG:
        return this.canUserCreateTags(createDto as CreateTagsDto);
      case Resource.PATROL:
        return this.canUserCreatePatrol(createDto as CreatePatrolDto);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private canUserCreateSuperAdmin(CreateSuperAdminDto: CreateSuperAdminDto) {
    const host = this.request?.get('host');
    return this.user.isSuperAdmin() && LOCALHOST_REGEX.test(host);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private canUserCreateCompany(createCompanyDto: CreateCompanyDto) {
    return this.user.isSuperAdmin();
  }
  private canUserCreateCompanyAdmin(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCompanyAdminDto: CreateCompanyAdminDto,
  ) {
    return this.user.isSuperAdmin();
  }
  private canUserCreateSiteAdmin(createSiteAdminDto: CreateSiteAdminDto) {
    const { companyId: siteCompanyId } = createSiteAdminDto;
    const { companyId: userCompanyId } = this.user;
    const { site }: { site: Site } = createSiteAdminDto as any;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.belongsToCompany(siteCompanyId) &&
      site.belongsToCompany(userCompanyId);
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private canUserCreateSecurityGuard(
    createSecurityGuardDto: CreateSecurityGuardDto,
  ) {
    const { companyId: securityGuardCompanyId } = createSecurityGuardDto;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.belongsToCompany(securityGuardCompanyId);
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private canUserCreateSite(createSiteDto: CreateSiteDto) {
    const { companyId: siteCompanyId, notificationsEnabled } = createSiteDto;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    // Company Admins aren't allowed to toggle site notifications
    const isTogglingNotifications = notificationsEnabled !== undefined;
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.belongsToCompany(siteCompanyId) &&
      !isTogglingNotifications;
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private canUserCreateTags(createTagsDto: CreateTagsDto) {
    const { companyId: tagsCompanyId } = createTagsDto;
    const { site }: { site: Site } = createTagsDto as any;
    const { companyId: userCompanyId } = this.user;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.belongsToCompany(tagsCompanyId) &&
      site.belongsToCompany(userCompanyId);
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private canUserCreatePatrol(createPatrolDto: CreatePatrolDto) {
    return true;
  }

  //Determine if a user can read a given resource / collection
  async read(
    resource: Resource,
    resourceId: number | undefined,
    { throwError = false } = {},
  ) {
    this.handleUndefinedUser();
    const canReadResource = await this.handleReadPermissions(
      resource,
      resourceId,
    );
    if (!canReadResource && throwError) throw new ForbiddenException();
    return canReadResource;
  }

  private async handleReadPermissions(resource: Resource, resourceId?: number) {
    switch (resource) {
      case Resource.SUPER_ADMIN:
        return this.canUserReadSuperAdmin(resourceId as number);
      case Resource.COMPANY:
        return this.canUserReadCompany(resourceId);
      case Resource.COMPANY_ADMIN:
        return this.canUserReadCompanyAdmin(resourceId);
      case Resource.SITE_ADMIN:
        return await this.canUserReadSiteAdmin(resourceId);
      case Resource.SECURITY_GUARD:
        return this.canUserReadSecurityGuard(resourceId);
      case Resource.SITE:
        return this.canUserReadSite(resourceId);
      case Resource.NOTIFICATION:
        // For notifications, these are only accessed through a site and are read as a collection
        // So if one can read a site, then they can read site notifications
        return true;
      case Resource.TAG:
        return this.canUserReadTag(resourceId);
      case Resource.PATROL:
        return this.canUserReadPatrol(resourceId);
      case Resource.STATS:
        return this.canUserReadStats();
      default:
        return false;
    }
  }

  private async canUserReadSuperAdmin(superAdminId?: number) {
    return this.user.id === superAdminId; // super admin reading his own
  }
  private async canUserReadCompany(companyId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed = this.user.isCompanyAdmin() || this.user.isSiteAdmin();
    if (isOthersAllowed && companyId) {
      isOthersAllowed =
        isOthersAllowed &&
        (await this.hasReadPerms(Resource.COMPANY, companyId));
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private async canUserReadCompanyAdmin(companyAdminId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed && companyAdminId) {
      isCompanyAdminAllowed =
        isCompanyAdminAllowed &&
        (await this.hasReadPerms(Resource.COMPANY_ADMIN, companyAdminId));
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserReadSiteAdmin(siteAdminId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed && siteAdminId) {
      isCompanyAdminAllowed =
        isCompanyAdminAllowed &&
        (await this.hasReadPerms(Resource.SITE_ADMIN, siteAdminId));
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserReadSecurityGuard(securityGuardId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed = this.user.isCompanyAdmin() || this.user.isSiteAdmin();
    if (isOthersAllowed && securityGuardId) {
      isOthersAllowed =
        isOthersAllowed &&
        (await this.hasReadPerms(Resource.SECURITY_GUARD, securityGuardId));
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private async canUserReadSite(siteId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed = this.user.isCompanyAdmin() || this.user.isSiteAdmin();
    if (isOthersAllowed && siteId) {
      isOthersAllowed =
        isOthersAllowed && (await this.hasReadPerms(Resource.SITE, siteId));
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private async canUserReadTag(tagId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed = this.user.isCompanyAdmin() || this.user.isSiteAdmin();
    if (isOthersAllowed && tagId) {
      isOthersAllowed =
        isOthersAllowed && (await this.hasReadPerms(Resource.TAG, tagId));
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private canUserReadStats() {
    return this.user.isSuperAdmin();
  }

  private async canUserReadPatrol(patrolId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed = this.user.isCompanyAdmin() || this.user.isSiteAdmin();
    if (isOthersAllowed && patrolId) {
      isOthersAllowed =
        isOthersAllowed && (await this.hasReadPerms(Resource.PATROL, patrolId));
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  /**
   *
   * @param resource
   * @param resourceId
   * @param updateDto
   * @param param3
   * @returns
   *
   * Determine if a user can update a resource(s).
   */
  async update(
    resource: Resource,
    resourceId: number | undefined,
    updateDto: UpdateDto,
    { throwError = false } = {},
  ) {
    this.handleUndefinedUser();
    const canUpdateResource = await this.handleUpdatePermissions(
      resource,
      resourceId,
      updateDto,
    );
    if (!canUpdateResource && throwError) {
      throw new ForbiddenException();
    }
    return canUpdateResource;
  }

  private async handleUpdatePermissions(
    resource: Resource,
    resourceId: number | undefined,
    updateDto: UpdateDto,
  ) {
    switch (resource) {
      case Resource.SUPER_ADMIN:
        return this.canUserUpdateSuperAdmin(
          resourceId as number,
          updateDto as UpdateSuperAdminDto,
        );
      case Resource.COMPANY:
        return this.canUserUpdateCompany(
          resourceId as number,
          updateDto as UpdateCompanyDto,
        );
      case Resource.COMPANY_ADMIN:
        return this.canUserUpdateCompanyAdmin(
          resourceId as number,
          updateDto as UpdateCompanyAdminDto,
        );
      case Resource.SITE_ADMIN:
        return this.canUserUpdateSiteAdmin(
          resourceId as number,
          updateDto as UpdateSiteAdminDto,
        );
      case Resource.SECURITY_GUARD:
        return this.canUserUpdateSecurityGuard(
          resourceId as number,
          updateDto as any,
        );
      case Resource.SITE:
        return this.canUserUpdateSite(
          resourceId as number,
          updateDto as UpdateSiteDto,
        );
      case Resource.TAG:
        return this.canUserUpdateTags(resourceId, updateDto as any);
      default:
        return false;
    }
  }
  private canUserUpdateSuperAdmin(
    superAdminId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSuperAdminDto: UpdateSuperAdminDto,
  ) {
    const { id: userId } = this.user;
    const isMySelf = userId === superAdminId;
    return this.user.isSuperAdmin() && isMySelf;
  }
  private canUserUpdateCompany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    companyId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.user.isSuperAdmin();
  }

  private canUserUpdateCompanyAdmin(
    companyAdminId: number,
    updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    const { email } = updateCompanyAdminDto;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    /* A company admin is allowed to update HIS/HER data only if they aren't
    trying to update their email */
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.id === companyAdminId &&
      email === undefined;
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateSiteAdmin(
    siteAdminId: number,
    updateSiteAdminDto: UpdateSiteAdminDto,
  ) {
    const { companyId: userCompanyId } = this.user;
    const { site }: { site: Site } = updateSiteAdminDto as any;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.userBelongsToCompany(
        siteAdminId,
        userCompanyId,
        Role.SITE_ADMIN,
      ));

    /* If the company admin is assigning the site admin to another site, then
     the new site should also belong to the company admin's company */
    const isSwitchingSite = !!site;
    if (isCompanyAdminAllowed && isSwitchingSite) {
      isCompanyAdminAllowed =
        isCompanyAdminAllowed && site.belongsToCompany(userCompanyId);
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateSecurityGuard(
    securityGuardId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDto: UpdateSecurityGuardDto,
  ) {
    const { companyId: userCompanyId } = this.user;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.userBelongsToCompany(
        securityGuardId as number,
        userCompanyId,
        Role.SECURITY_GUARD,
      ));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateSite(
    siteId: number,
    updateSiteDto: UpdateSiteDto,
  ) {
    const { companyId: userCompanyId } = this.user;
    const { notificationsEnabled } = updateSiteDto;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    // Company admins aren't allowed to toggle site notifications
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      notificationsEnabled === undefined &&
      (await this.siteBelongsToCompany(siteId, userCompanyId));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateTags(
    tagId: number | undefined,
    updateDto: UpdateTagUIDDto | TagsActionDto,
  ) {
    // TagsActionDto doesn't require a tagId(DB Primary Key), the tag Ids are embedded in the
    // updateDto, on the other hand, UpdateTagUIDDto requires a tagId.
    const isUpdatingTagUID = updateDto instanceof UpdateTagUIDDto;
    if (isUpdatingTagUID && !tagId) return false;

    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();

    const { companyId: userCompanyId } = this.user;
    if (isUpdatingTagUID && isCompanyAdminAllowed) {
      const tagBelongsToUserCompany = await this.tagBelongsToCompany(
        tagId as number,
        userCompanyId,
      );
      isCompanyAdminAllowed = isCompanyAdminAllowed && tagBelongsToUserCompany;
    } else if (updateDto instanceof TagsActionDto && isCompanyAdminAllowed) {
      const { tags }: { tags: Tag[] } = updateDto as any;
      const tagsBelongToUserCompany = tags.every((tag) =>
        tag.belongsToCompany(userCompanyId),
      );
      isCompanyAdminAllowed = isCompanyAdminAllowed && tagsBelongToUserCompany;
      const { type } = updateDto;
      if (type === INSTALL_TAGS_ACTION) {
        const { site }: { site: Site } = updateDto as any;
        const siteBelongsToUserCompany = site.belongsToCompany(userCompanyId);
        isCompanyAdminAllowed =
          isCompanyAdminAllowed && siteBelongsToUserCompany;
      }
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  // Determine if a user can delete a resource
  async delete(
    resource: Resource,
    resourceIds: number[],
    { throwError = false } = {},
  ) {
    this.handleUndefinedUser();
    const canDeleteResource = await this.handleDeletePermissions(
      resource,
      resourceIds,
    );
    if (throwError) throw new ForbiddenException();
    return canDeleteResource;
  }
  private async handleDeletePermissions(
    resource: Resource,
    resourceIds: number[],
  ) {
    switch (resource) {
      case Resource.SUPER_ADMIN:
        return this.canUserDeleteSuperAdmin(resourceIds[0]);
      case Resource.COMPANY:
        return this.canUserDeleteCompany();
      case Resource.COMPANY_ADMIN:
        return this.canUserDeleteCompanyAdmin();
      case Resource.SITE_ADMIN:
        return await this.canUserDeleteSiteAdmin(...resourceIds);
      case Resource.SECURITY_GUARD:
        return this.canUserDeleteSecurityGuard(...resourceIds);
      case Resource.SITE:
        return this.canUserDeleteSite(...resourceIds);
      case Resource.TAG:
        return this.canUserDeleteTag(...resourceIds);
      case Resource.PATROL:
        return this.canUserDeletePatrol(...resourceIds);
      default:
        return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private canUserDeleteSuperAdmin(superAdminId: number) {
    const host = this.request?.get('host');
    const { id: userId } = this.user;
    const isNotMySelf = userId !== superAdminId;
    return (
      this.user.isSuperAdmin() && isNotMySelf && LOCALHOST_REGEX.test(host)
    );
  }
  private canUserDeleteCompany() {
    return this.user.isSuperAdmin();
  }

  private canUserDeleteCompanyAdmin() {
    return this.user.isSuperAdmin();
  }

  private async canUserDeleteSiteAdmin(...siteAdminIds: number[]) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed) {
      const { companyId: userCompanyId } = this.user;
      const siteAdminBelongsToCompany = await this.usersBelongToCompany(
        siteAdminIds,
        userCompanyId,
        Role.SITE_ADMIN,
      );
      isCompanyAdminAllowed =
        isCompanyAdminAllowed && siteAdminBelongsToCompany;
    }

    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteSecurityGuard(...securityGuardIds: number[]) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed) {
      const { companyId: userCompanyId } = this.user;
      isCompanyAdminAllowed =
        isCompanyAdminAllowed &&
        (await this.usersBelongToCompany(
          securityGuardIds,
          userCompanyId,
          Role.SECURITY_GUARD,
        ));
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteSite(...siteIds: number[]) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed) {
      const { companyId: userCompanyId } = this.user;
      isCompanyAdminAllowed =
        isCompanyAdminAllowed &&
        (await this.sitesBelongToCompany(siteIds, userCompanyId));
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteTag(...tagIds: number[]) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed) {
      const { companyId: userCompanyId } = this.user;
      isCompanyAdminAllowed =
        isCompanyAdminAllowed &&
        (await this.tagsBelongToCompany(tagIds, userCompanyId));
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async canUserDeletePatrol(...patrolIds: number[]) {
    return false;
  }
  filter(resource: Resource) {
    this.handleUndefinedUser();
    this.resource = resource;
    return this;
  }

  async with(query: PaginateQuery) {
    this.handleUndefinedUser();
    this.handleUndefinedResource();
    return await this.handlePaginationQueryPermissions(query);
  }

  private async handlePaginationQueryPermissions(query: PaginateQuery) {
    const { filter } = query;
    if (!filter) return true;

    switch (this.resource) {
      case Resource.COMPANY_ADMIN:
        return this.canUserFilterOnCompany(filter);
      case Resource.SITE_ADMIN:
        return (
          (await this.canUserFilterOnCompany(filter)) &&
          (await this.canUserFilterOnSite(filter))
        );
      case Resource.SECURITY_GUARD:
        return await this.canUserFilterOnCompany(filter);
      case Resource.TAG:
        return (
          (await this.canUserFilterOnCompany(filter)) &&
          (await this.canUserFilterOnSite(filter))
        );
      case Resource.PATROL:
        return await this.canUserFilterOnSite(filter);
      default:
        return false;
    }
  }

  private async canUserFilterOnCompany(filter: any) {
    let canFilterOnCompanies = true;
    const companyIds = this.extractIdsFromFilter(filter, Resource.COMPANY);
    const filterHasNoCompanies = companyIds.length === 0;
    if (filterHasNoCompanies) return true;

    const filterHasMultipleCompanies = companyIds.length > 1;
    if (filterHasMultipleCompanies) {
      /* Only super admins can filter on more than one company while the rest of the
      users can only filter on a single company and that's the company to which they belong */
      canFilterOnCompanies = this.user.isSuperAdmin();
    } else {
      canFilterOnCompanies = await this.hasReadPerms(
        Resource.COMPANY,
        companyIds[0],
      );
    }
    if (!canFilterOnCompanies) {
      throw new ForbiddenException(
        "You aren't allowed to filter on the given company",
      );
    }
    return canFilterOnCompanies;
  }

  private async canUserFilterOnSite(filter: any) {
    let canFilterOnSites = true;
    const siteIds = this.extractIdsFromFilter(filter, Resource.SITE);
    const filterHasNoSites = siteIds.length === 0;
    if (filterHasNoSites) return true;

    // Filtering on many sites is allowed for every user for as long as the sites belong to the user's
    // company except for super admins who don't have any restrictions on the sites they can filter on
    const filterHasSingleSite = siteIds.length === 1;
    const { companyId: userCompanyId } = this.user;
    if (filterHasSingleSite) {
      canFilterOnSites =
        this.user.isSuperAdmin() ||
        (!this.user.isSuperAdmin() &&
          (await this.sitesBelongToCompany(siteIds, userCompanyId)));
    } else {
      canFilterOnSites =
        this.user.isSuperAdmin() ||
        (!this.user.isSuperAdmin() &&
          (await this.sitesBelongToCompany(siteIds, userCompanyId)));
    }
    if (!canFilterOnSites) {
      throw new ForbiddenException(
        "You aren't allowed to filter on the given site(s)",
      );
    }

    return canFilterOnSites;
  }

  private extractIdsFromFilter(filter: any, resource: Resource) {
    let filterValue: string | string[] | undefined;
    const nullIdRegex = /^\$null$/i;
    const idsRegex = /^\$in:(?<ids>[0-9,]+)$/i;

    switch (resource) {
      case Resource.COMPANY:
        filterValue = filter.companyId;
        break;
      case Resource.SITE:
        filterValue = filter.siteId;
        break;
      default:
        return [];
    }
    const isUndefinedValue = !filterValue;
    const isNullId = isString(filterValue) && nullIdRegex.test(filterValue);
    if (isUndefinedValue || isNullId) {
      return [];
    }
    let ids: number[] = [];

    if (isArray(filterValue)) {
      ids = filterValue.map((id) => +id);
    } else if (isString(filterValue) && filterValue.trim() != '') {
      ids = filterValue
        .match(idsRegex)
        ?.groups?.ids?.split(',')
        .map((id) => +id) || [+filterValue];
    }
    return ids;
  }

  private handleUndefinedResource() {
    if (!this.resource) {
      const undefinedResourceErrMsg =
        'Invoke filter() method before invoking with()';
      throw new Error(undefinedResourceErrMsg);
    }
  }
  private handleUndefinedUser() {
    if (!this.user) {
      const undefinedUserErrMsg =
        'Invoke can() method before invoking create() or read() or update() or delete() or filter() methods';
      throw new Error(undefinedUserErrMsg);
    }
  }

  async siteBelongsToCompany(siteId: number, companyId: number) {
    const site = await this.entityManager
      .getRepository<Site>(Site)
      .findOneBy({ id: siteId, companyId });
    return !!site;
  }

  async sitesBelongToCompany(siteIds: number[], companyId: number) {
    const sites = await this.entityManager
      .getRepository<Site>(Site)
      .find({ where: { id: In(siteIds), companyId } });
    return sites.length === siteIds.length;
  }

  // The user's role helps in determining the table in which to find the user(s)
  async userBelongsToCompany(userId: number, companyId: number, role: Role) {
    switch (role) {
      case Role.SUPER_ADMIN:
        return false;
      case Role.COMPANY_ADMIN:
        return !!(await this.entityManager
          .getRepository<CompanyAdmin>(CompanyAdmin)
          .findOneBy({
            userId,
            companyId,
          }));
      case Role.SITE_ADMIN:
        return !!(await this.entityManager
          .getRepository<SiteAdmin>(SiteAdmin)
          .findOneBy({
            userId,
            companyId,
          }));
      case Role.SECURITY_GUARD:
        return !!(await this.entityManager
          .getRepository<SecurityGuard>(SecurityGuard)
          .findOneBy({
            userId,
            companyId,
          }));
      default:
        return false;
    }
  }

  // The user's role helps in determining the table in which to find the user(s)
  async usersBelongToCompany(
    userIds: number[],
    companyId: number,
    userRole: Role,
  ) {
    switch (userRole) {
      case Role.SUPER_ADMIN:
        return false;
      case Role.COMPANY_ADMIN:
        const companyAdmins = await this.entityManager
          .getRepository<CompanyAdmin>(CompanyAdmin)
          .find({
            where: {
              userId: In(userIds),
              companyId,
            },
          });
        return companyAdmins.length === userIds.length;
      case Role.SITE_ADMIN:
        const siteAdmins = await this.entityManager
          .getRepository<SiteAdmin>(SiteAdmin)
          .find({
            where: {
              userId: In(userIds),
              companyId,
            },
          });
        return siteAdmins.length === userIds.length;
      case Role.SECURITY_GUARD:
        const securityGuards = await this.entityManager
          .getRepository<SecurityGuard>(SecurityGuard)
          .find({
            where: {
              userId: In(userIds),
              companyId,
            },
          });
        return securityGuards.length === userIds.length;
      default:
        return false;
    }
  }

  async tagBelongsToCompany(tagId: number, companyId: number) {
    const tag = await this.entityManager
      .getRepository<Tag>(Tag)
      .findOneBy({ id: tagId, companyId });
    return !!tag;
  }

  async tagsBelongToCompany(tagIds: number[], companyId: number) {
    const tags = await this.entityManager
      .getRepository<Tag>(Tag)
      .find({ where: { id: In(tagIds), companyId } });
    return tags.length === tagIds.length;
  }

  /**
   * Determine ownership of a resource. Company Admin ownership is determined if the resource
   * belongs to the company. Super admins own everything except other super admins
   * For resources that can only be accessed as a collection i.e. tags, patrols, this method doesn't
   * address such resources because it's responsible for only determining read permissions
   * for only a specific instance of a resource. Services will be responsible for returning resource records
   * to which the user has read access
   *
   */
  private async hasReadPerms(resource: Resource, resourceId: number) {
    const {
      id: userId,
      companyId: userCompanyId,
      role,
      managedSiteId,
      deployedSiteId,
    } = this.user as any;

    // Super Admins can read any resource except for fellow super admins
    if (this.user.isSuperAdmin() && resource !== Resource.SUPER_ADMIN)
      return true;

    let hasReadAccess = false;
    switch (resource) {
      case Resource.SUPER_ADMIN:
        hasReadAccess = userId === resourceId;
        break;
      case Resource.COMPANY:
        hasReadAccess = userCompanyId === resourceId;
        break;
      case Resource.COMPANY_ADMIN:
        switch (role) {
          case Role.COMPANY_ADMIN:
            hasReadAccess = userId === resourceId;
            break;
          default:
            hasReadAccess = false;
        }
        break;
      case Resource.SITE_ADMIN:
        switch (role) {
          case Role.COMPANY_ADMIN:
            hasReadAccess = await this.userBelongsToCompany(
              resourceId,
              userCompanyId,
              Role.SITE_ADMIN,
            );
            break;
          case Role.SITE_ADMIN:
            hasReadAccess = userId === resourceId;
            break;
          default:
            hasReadAccess = false;
        }
        break;
      case Resource.SECURITY_GUARD:
        switch (role) {
          case Role.COMPANY_ADMIN:
            hasReadAccess = await this.userBelongsToCompany(
              resourceId,
              userCompanyId,
              Role.SECURITY_GUARD,
            );
            break;
          case Role.SITE_ADMIN:
            hasReadAccess = await this.userBelongsToCompany(
              resourceId,
              userCompanyId,
              Role.SECURITY_GUARD,
            );
            break;
          case Role.SECURITY_GUARD:
            hasReadAccess = userId === resourceId;
            break;
          default:
            hasReadAccess = false;
        }
        break;
      case Resource.SITE:
        switch (role) {
          case Role.COMPANY_ADMIN:
            hasReadAccess = await this.siteBelongsToCompany(
              resourceId,
              userCompanyId,
            );
            break;
          case Role.SITE_ADMIN:
            hasReadAccess = managedSiteId === resourceId;
            break;
          case Role.SECURITY_GUARD:
            hasReadAccess = deployedSiteId === resourceId;
            break;
          default:
            hasReadAccess = false;
        }
        break;
      default:
        hasReadAccess = false;
    }
    return hasReadAccess;
  }
}
