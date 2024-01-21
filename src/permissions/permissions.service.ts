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
import { Patrol } from '../patrol/entities/patrol.entity';
import { CreateDto, UpdateDto } from './permissions.types';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { CreateCompanyAdminDto } from '../user/dto/create-company-admin.dto';
import { UpdateCompanyDto } from '../company/dto/update-company.dto';
import { UpdateCompanyAdminDto } from '../user/dto/update-company-admin.dto';
import { CreateSuperAdminDto } from '../user/dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../user/dto/update-super-admin.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { isArray } from 'class-validator';
import { CreatePatrolDto } from '../patrol/dto/create-patrol.dto';
import { TagsActionDto } from '../tag/dto/tags-action.dto';
import { INSTALL_TAGS_ACTION } from '../tag/tag.constants';

@Injectable()
export class PermissionsService {
  private user: User;
  private resource: Resource;

  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

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
    return this.user.isSuperAdmin();
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
    const canCreateAnySiteAdmin = this.user.isSuperAdmin();
    let canCreateOwnSiteAdmin = this.user.isCompanyAdmin();
    if (canCreateOwnSiteAdmin) {
      canCreateOwnSiteAdmin =
        canCreateOwnSiteAdmin &&
        site.belongsToCompany(userCompanyId) &&
        this.user.belongsToCompany(siteCompanyId);
    }
    return canCreateAnySiteAdmin || canCreateOwnSiteAdmin;
  }

  private canUserCreateSecurityGuard(
    createSecurityGuardDto: CreateSecurityGuardDto,
  ) {
    const { companyId: securityGuardCompanyId } = createSecurityGuardDto;
    const canCreateAnySecurityGuard = this.user.isSuperAdmin();
    let canCreateOwnSecurityGuard = this.user.isCompanyAdmin();
    if (canCreateOwnSecurityGuard) {
      canCreateOwnSecurityGuard =
        canCreateOwnSecurityGuard &&
        this.user.belongsToCompany(securityGuardCompanyId);
    }
    return canCreateAnySecurityGuard || canCreateOwnSecurityGuard;
  }

  private canUserCreateSite(createSiteDto: CreateSiteDto) {
    const { companyId: siteCompanyId } = createSiteDto;
    const canCreateAnySite = this.user.isSuperAdmin();
    let canCreateOwnSite = this.user.isCompanyAdmin();
    if (canCreateOwnSite) {
      canCreateOwnSite =
        canCreateOwnSite && this.user.belongsToCompany(siteCompanyId);
    }
    return canCreateAnySite || canCreateOwnSite;
  }

  private canUserCreateTags(createTagsDto: CreateTagsDto) {
    const { companyId: tagsCompanyId } = createTagsDto;
    const { site }: { site: Site } = createTagsDto as any;
    const canCreateAnyTags = this.user.isSuperAdmin();
    let canCreateOwnTags = this.user.isCompanyAdmin();
    if (canCreateOwnTags) {
      const { companyId: userCompanyId } = this.user;
      canCreateOwnTags =
        canCreateOwnTags &&
        this.user.belongsToCompany(tagsCompanyId) &&
        site.belongsToCompany(userCompanyId);
    }
    return canCreateAnyTags || canCreateOwnTags;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private canUserCreatePatrol(createPatrolDto: CreatePatrolDto) {
    return this.user.isSecurityGuard();
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
      case Resource.TAG:
        return this.canUserReadTag(resourceId);
      case Resource.SHIFT:
        return this.canUserReadShift(resourceId);
      case Resource.PATROL:
        return this.canUserReadPatrol(resourceId);
      default:
        return false;
    }
  }

  private async canUserReadSuperAdmin(superAdminId?: number) {
    return this.user.id === superAdminId; // super admin reading his own
  }
  private async canUserReadCompany(companyId?: number) {
    const canReadAnyCompany = this.user.isSuperAdmin();
    let canReadOwnCompany =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSecurityGuard();
    if (canReadOwnCompany && companyId) {
      canReadOwnCompany =
        canReadOwnCompany &&
        (await this.hasReadPerms(Resource.COMPANY, companyId));
    }
    return canReadAnyCompany || canReadOwnCompany;
  }

  private async canUserReadCompanyAdmin(companyAdminId?: number) {
    const canReadAnyCompanyAdmin = this.user.isSuperAdmin();
    let canReadOwnCompanyAdmin = this.user.isCompanyAdmin();
    if (canReadOwnCompanyAdmin && companyAdminId) {
      canReadOwnCompanyAdmin =
        canReadOwnCompanyAdmin &&
        (await this.hasReadPerms(Resource.COMPANY_ADMIN, companyAdminId));
    }
    return canReadAnyCompanyAdmin || canReadOwnCompanyAdmin;
  }

  private async canUserReadSiteAdmin(siteAdminId?: number) {
    const canReadAnySiteAdmin = this.user.isSuperAdmin();
    let canReadOwnSiteAdmin = this.user.isCompanyAdmin();
    if (canReadOwnSiteAdmin && siteAdminId) {
      canReadOwnSiteAdmin =
        canReadOwnSiteAdmin &&
        (await this.hasReadPerms(Resource.SITE_ADMIN, siteAdminId));
    }
    return canReadAnySiteAdmin || canReadOwnSiteAdmin;
  }

  private async canUserReadSecurityGuard(securityGuardId?: number) {
    const canReadAnySecurityGuard = this.user.isSuperAdmin();
    let canReadOwnSecurityGuard =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSecurityGuard();
    if (canReadOwnSecurityGuard && securityGuardId) {
      canReadOwnSecurityGuard =
        canReadOwnSecurityGuard &&
        (await this.hasReadPerms(Resource.SECURITY_GUARD, securityGuardId));
    }
    return canReadAnySecurityGuard || canReadOwnSecurityGuard;
  }

  private async canUserReadSite(siteId?: number) {
    const canReadAnySite = this.user.isSuperAdmin();
    let canReadOwnSite =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSecurityGuard();
    if (canReadOwnSite && siteId) {
      canReadOwnSite =
        canReadOwnSite && (await this.hasReadPerms(Resource.SITE, siteId));
    }
    return canReadAnySite || canReadOwnSite;
  }

  private async canUserReadTag(tagId?: number) {
    const canReadAnyTag = this.user.isSuperAdmin();
    let canReadOwnTag =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSecurityGuard();
    if (canReadOwnTag && tagId) {
      canReadOwnTag =
        canReadOwnTag && (await this.hasReadPerms(Resource.TAG, tagId));
    }
    return canReadAnyTag || canReadOwnTag;
  }

  private async canUserReadShift(shiftId?: number) {
    const canReadAnyShift = this.user.isSuperAdmin();
    let canReadOwnShift =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSecurityGuard();
    if (canReadOwnShift && shiftId) {
      canReadOwnShift =
        canReadOwnShift && (await this.hasReadPerms(Resource.SHIFT, shiftId));
    }
    return canReadAnyShift || canReadOwnShift;
  }

  private async canUserReadPatrol(patrolId?: number) {
    const canReadAnyPatrol = this.user.isSuperAdmin();
    let canReadOwnPatrol =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSecurityGuard();
    if (canReadOwnPatrol && patrolId) {
      canReadOwnPatrol =
        canReadOwnPatrol &&
        (await this.hasReadPerms(Resource.PATROL, patrolId));
    }
    return canReadAnyPatrol || canReadOwnPatrol;
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
        return this.canUserUpdateSite(resourceId as number);
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
    return this.user.isSuperAdmin() && superAdminId === userId;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    companyAdminId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    return this.user.isSuperAdmin();
  }

  private async canUserUpdateSiteAdmin(
    siteAdminId: number,
    updateSiteAdminDto: UpdateSiteAdminDto,
  ) {
    const { companyId: userCompanyId } = this.user;
    const { site }: { site: Site } = updateSiteAdminDto as any;
    const canUpdateAnySiteAdmin = this.user.isSuperAdmin();
    let canUpdateOwnSiteAdmin = this.user.isCompanyAdmin();
    if (canUpdateOwnSiteAdmin) {
      const siteAdminBelongsToCompany = await this.userBelongsToCompany(
        siteAdminId,
        userCompanyId,
        Role.SITE_ADMIN,
      );
      canUpdateOwnSiteAdmin =
        canUpdateOwnSiteAdmin && siteAdminBelongsToCompany;
    }

    // If the user is assigning the site admin another site, then the new site should
    // belong to the user's company
    if (!!site && canUpdateOwnSiteAdmin) {
      canUpdateOwnSiteAdmin =
        canUpdateOwnSiteAdmin && site.belongsToCompany(userCompanyId);
    }
    return canUpdateAnySiteAdmin || canUpdateOwnSiteAdmin;
  }

  private async canUserUpdateSecurityGuard(
    securityGuardId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDto: UpdateSecurityGuardDto,
  ) {
    const { companyId: userCompanyId } = this.user;
    const canUpdateAnySecurityGuard = this.user.isSuperAdmin();
    const canUpdateOwnSecurityGuards = this.user.isCompanyAdmin();
    if (canUpdateOwnSecurityGuards) {
      canUpdateOwnSecurityGuards &&
        (await this.userBelongsToCompany(
          securityGuardId as number,
          userCompanyId,
          Role.SECURITY_GUARD,
        ));
    }
    return canUpdateAnySecurityGuard || canUpdateOwnSecurityGuards;
  }

  private async canUserUpdateSite(siteId: number) {
    const canUpdateAnySite = this.user.isSuperAdmin();
    let canUpdateOwnSite = this.user.isCompanyAdmin();
    if (canUpdateOwnSite) {
      const { companyId: userCompanyId } = this.user;
      canUpdateOwnSite =
        canUpdateOwnSite &&
        (await this.siteBelongsToCompany(siteId, userCompanyId));
    }
    return canUpdateAnySite || canUpdateOwnSite;
  }

  private async canUserUpdateTags(
    tagId: number | undefined,
    updateDto: UpdateTagUIDDto | TagsActionDto,
  ) {
    // TagsActionDto doesn't require a tagId, the tag Ids are embedded in the
    // updateDto
    const updateTagUID = updateDto instanceof UpdateTagUIDDto;
    if (updateTagUID && !tagId) return false;

    const canUpdateAnyTags = this.user.isSuperAdmin();
    let canUpdateOwnTags = this.user.isCompanyAdmin();

    const { companyId: userCompanyId } = this.user;
    if (updateTagUID && canUpdateOwnTags) {
      const tagBelongsToUserCompany = await this.tagBelongsToCompany(
        tagId as number,
        userCompanyId,
      );
      canUpdateOwnTags = canUpdateOwnTags && tagBelongsToUserCompany;
    } else if (updateDto instanceof TagsActionDto && canUpdateOwnTags) {
      const { tags }: { tags: Tag[] } = updateDto as any;
      const tagsBelongToUserCompany = tags.every((tag) =>
        tag.belongsToCompany(userCompanyId),
      );
      canUpdateOwnTags = canUpdateOwnTags && tagsBelongToUserCompany;
      const { type } = updateDto;
      if (type === INSTALL_TAGS_ACTION) {
        const { site }: { site: Site } = updateDto as any;
        const siteBelongsToUserCompany = site.belongsToCompany(userCompanyId);
        canUpdateOwnTags = canUpdateOwnTags && siteBelongsToUserCompany;
      }
    }
    return canUpdateAnyTags || canUpdateOwnTags;
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
    return false;
  }
  private canUserDeleteCompany() {
    return this.user.isSuperAdmin();
  }

  private canUserDeleteCompanyAdmin() {
    return this.user.isSuperAdmin();
  }

  private async canUserDeleteSiteAdmin(...siteAdminIds: number[]) {
    const canDeleteAnySiteAdmin = this.user.isSuperAdmin();
    let canDeleteOwnSiteAdmin = this.user.isCompanyAdmin();
    if (canDeleteOwnSiteAdmin) {
      const { companyId: userCompanyId } = this.user;
      const siteAdminBelongsToCompany = await this.usersBelongToCompany(
        siteAdminIds,
        userCompanyId,
        Role.SITE_ADMIN,
      );
      canDeleteOwnSiteAdmin =
        canDeleteOwnSiteAdmin && siteAdminBelongsToCompany;
    }

    return canDeleteAnySiteAdmin || canDeleteOwnSiteAdmin;
  }

  private async canUserDeleteSecurityGuard(...securityGuardIds: number[]) {
    const canDeleteAnySecurityGuard = this.user.isSuperAdmin();
    let canDeleteOwnSecurityGuard = this.user.isCompanyAdmin();
    if (canDeleteOwnSecurityGuard) {
      const { companyId: userCompanyId } = this.user;
      canDeleteOwnSecurityGuard =
        canDeleteOwnSecurityGuard &&
        (await this.usersBelongToCompany(
          securityGuardIds,
          userCompanyId,
          Role.SECURITY_GUARD,
        ));
    }
    return canDeleteAnySecurityGuard || canDeleteOwnSecurityGuard;
  }

  private async canUserDeleteSite(...siteIds: number[]) {
    const canDeleteAnySite = this.user.isSuperAdmin();
    let canDeleteOwnSite = this.user.isCompanyAdmin();
    if (canDeleteOwnSite) {
      const { companyId: userCompanyId } = this.user;
      canDeleteOwnSite =
        canDeleteOwnSite &&
        (await this.sitesBelongToCompany(siteIds, userCompanyId));
    }
    return canDeleteAnySite || canDeleteOwnSite;
  }

  private async canUserDeleteTag(...tagIds: number[]) {
    const canDeleteAnyTag = this.user.isSuperAdmin();
    let canDeleteOwnTag = this.user.isCompanyAdmin();
    if (canDeleteOwnTag) {
      const { companyId: userCompanyId } = this.user;
      canDeleteOwnTag =
        canDeleteOwnTag &&
        (await this.tagsBelongToCompany(tagIds, userCompanyId));
    }
    return canDeleteAnyTag || canDeleteOwnTag;
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
      case Resource.SUPER_ADMIN:
        return true;
      case Resource.COMPANY:
        return true;
      case Resource.COMPANY_ADMIN:
        return this.canUserFilterOnCompany(filter);
      case Resource.SITE_ADMIN:
        return (
          (await this.canUserFilterOnCompany(filter)) &&
          (await this.canUserFilterOnSite(filter))
        );
      case Resource.SECURITY_GUARD:
        return (
          (await this.canUserFilterOnCompany(filter)) &&
          (await this.canUserFilterOnSite(filter))
        );
      case Resource.SITE:
        return true;
      case Resource.TAG:
        return (
          (await this.canUserFilterOnCompany(filter)) &&
          (await this.canUserFilterOnSite(filter))
        );
      case Resource.SHIFT:
        return await this.canUserFilterOnSite(filter);
      case Resource.PATROL:
        return await this.canUserFilterOnSite(filter);
      default:
        return false;
    }
  }
  private async canUserFilterOnCompany(filter: any) {
    const { companyId } = filter;
    if (!companyId) return true;

    const canFilterOnSingleCompany = async (companyId: number) => {
      return this.hasReadPerms(Resource.COMPANY, companyId);
    };

    let canFilterOnCompany = true;
    if (isArray(companyId)) {
      const moreThanOneCompany = companyId.length > 1;
      if (moreThanOneCompany) {
        // Only super admins can filter on more than one company because they aren't attached to any company while
        // the rest of the users can only belong to a single company
        canFilterOnCompany = this.user.isSuperAdmin();
      } else {
        canFilterOnCompany = await canFilterOnSingleCompany(companyId[0]);
      }
    } else {
      // Other users(company admins, site admins, security guards) can only filter on a single company and that company
      // should be the company to which they belong.
      canFilterOnCompany = await canFilterOnSingleCompany(companyId);
    }
    if (!canFilterOnCompany) {
      throw new ForbiddenException(
        "You aren't allowed to filter on the given company",
      );
    }
    return canFilterOnCompany;
  }

  private async canUserFilterOnSite(filter: any) {
    // The site is named differently in some pagination queries
    const { deployedSiteId: deployedSiteId } = filter;
    let { siteId } = filter;
    siteId = siteId || deployedSiteId;
    if (!siteId) return true;
    // Filtering on many sites is allowed for every user for as long as the sites belong to the user's
    // company except for super admins who don't have any restrictions on the sites they can filter on
    let canFilterOnSite = true;
    const { companyId: userCompanyId } = this.user;
    if (isArray(siteId)) {
      const cleanSiteIds = siteId.map((siteId) => Number.parseInt(siteId));
      canFilterOnSite =
        this.user.isSuperAdmin() ||
        (!this.user.isSuperAdmin() &&
          (await this.sitesBelongToCompany(cleanSiteIds, userCompanyId)));
    } else {
      const cleanSiteIds = [+siteId];
      canFilterOnSite =
        this.user.isSuperAdmin() ||
        (!this.user.isSuperAdmin() &&
          (await this.sitesBelongToCompany(cleanSiteIds, userCompanyId)));
    }
    if (!canFilterOnSite) {
      throw new ForbiddenException(
        "You aren't allowed to filter on the given site(s)",
      );
    }
    return canFilterOnSite;
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

  async isTagInstalledOnSite(tagId: number, siteId: number) {
    const tag = await this.entityManager
      .getRepository<Tag>(Tag)
      .findOneBy({ id: tagId, siteId });
    return !!tag;
  }

  async patrolBelongsToCompany(patrolId: number, companyId: number) {
    const patrol = await this.entityManager
      .getRepository<Patrol>(Patrol)
      .findOne({
        where: { id: patrolId },
        relations: { site: true },
      });
    return !!patrol && patrol.belongsToCompany(companyId);
  }

  async patrolBelongsToSite(patrolId: number, siteId: number) {
    const patrol = await this.entityManager
      .getRepository<Patrol>(Patrol)
      .findOne({
        where: { id: patrolId, siteId },
      });
    return !!patrol;
  }

  async patrolBelongsToSecurityGuard(
    patrolId: number,
    securityGuardId: number,
  ) {
    const patrol = await this.entityManager
      .getRepository<Patrol>(Patrol)
      .findOne({
        where: { id: patrolId, securityGuardId },
      });
    return !!patrol;
  }
  /**
   * Determine ownership of a resource. Company Admin ownership is determined if the resource
   * belongs to the company. Super admins own everything except themselves
   * And for the rest of the users, ownership is determined basing on some other entities
   * as seen below
   */
  private async hasReadPerms(resource: Resource, resourceId: number) {
    const {
      id: userId,
      companyId: userCompanyId,
      role,
      managedSiteId,
      deployedSiteId,
    } = this.user as any;

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
            hasReadAccess = await this.tagBelongsToCompany(
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
      case Resource.TAG:
        switch (role) {
          case Role.COMPANY_ADMIN:
            hasReadAccess = await this.tagBelongsToCompany(
              resourceId,
              userCompanyId,
            );
            break;
          case Role.SITE_ADMIN:
            hasReadAccess = await this.isTagInstalledOnSite(
              resourceId,
              managedSiteId,
            );
            break;
          case Role.SECURITY_GUARD:
            hasReadAccess = await this.isTagInstalledOnSite(
              resourceId,
              deployedSiteId,
            );
            break;
          default:
            hasReadAccess = false;
        }
        break;
      case Resource.PATROL:
        switch (role) {
          case Role.COMPANY_ADMIN:
            hasReadAccess = await this.patrolBelongsToCompany(
              resourceId,
              userCompanyId,
            );
            break;
          case Role.SITE_ADMIN:
            hasReadAccess = await this.patrolBelongsToSite(
              resourceId,
              managedSiteId,
            );
            break;
          case Role.SECURITY_GUARD:
            hasReadAccess = await this.patrolBelongsToSecurityGuard(
              resourceId,
              userId,
            );
            break;
        }
        break;
      default:
        hasReadAccess = false;
    }
    return hasReadAccess;
  }
}
