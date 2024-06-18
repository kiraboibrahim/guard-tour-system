import { ForbiddenException, Injectable } from '@nestjs/common';
import { Resource } from './permissions';
import { User } from '../auth/auth.types';
import { Role } from '../roles/roles';
import { CreateSiteAdminDto } from '../site-admin/dto/create-site-admin.dto';
import { Site } from '../site/entities/site.entity';
import { CreateSecurityGuardDto } from '../security-guard/dto/create-security-guard.dto';
import { CreateSiteDto } from '../site/dto/create-site.dto';
import { CreateTagsDto } from '../tag/dto/create-tags.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { CompanyAdmin } from '../company-admin/entities/company-admin.entity';
import { SiteAdmin } from '../site-admin/entities/site-admin.entity';
import { SecurityGuard } from '../security-guard/entities/security-guard.entity';
import { UpdateSiteAdminDto } from '../site-admin/dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../security-guard/dto/update-security-guard.dto';
import { UpdateTagUIDDto } from '../tag/dto/update-tag-uid.dto';
import { CreateDto, UpdateDto } from './permissions.types';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { CreateCompanyAdminDto } from '../company-admin/dto/create-company-admin.dto';
import { UpdateCompanyDto } from '../company/dto/update-company.dto';
import { UpdateCompanyAdminDto } from '../company-admin/dto/update-company-admin.dto';
import { CreateSuperAdminDto } from '../super-admin/dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../super-admin/dto/update-super-admin.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { isArray, isString } from 'class-validator';
import { CreatePatrolDto } from '../patrol/dto/create-patrol.dto';
import { TagsActionDto } from '../tag/dto/tags-action.dto';
import { INSTALL_TAGS_ACTION } from '../tag/tag.constants';
import { UpdateSiteDto } from '../site/dto/update-site.dto';
import { LOCALHOST_REGEX } from '../core/core.constants';
import { CreateSiteOwnerDto } from '../site-owner/dto/create-site-owner.dto';
import { UpdateSiteOwnerDto } from '../site-owner/dto/update-site-owner.dto';
import { SiteOwner } from '../site-owner/entities/site-owner.entity';

// TODO: Modify methods to throw exceptions instead of returning boolean values for permission checks
@Injectable()
export class PermissionsService {
  private user: User;
  private request: any;
  private resource: Resource;
  private companyAdminRepository: Repository<CompanyAdmin>;
  private siteAdminRepository: Repository<SiteAdmin>;
  private siteOwnerRepository: Repository<SiteOwner>;
  private securityGuardRepository: Repository<SecurityGuard>;
  private siteRepository: Repository<Site>;

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
    this.companyAdminRepository =
      this.entityManager.getRepository(CompanyAdmin);
    this.siteAdminRepository = this.entityManager.getRepository(SiteAdmin);
    this.siteOwnerRepository = this.entityManager.getRepository(SiteOwner);
    this.securityGuardRepository =
      this.entityManager.getRepository(SecurityGuard);
    this.siteRepository = this.entityManager.getRepository(Site);
  }

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
      case Resource.SITE_OWNER:
        return this.canUserCreateSiteOwner(createDto as CreateSiteOwnerDto);
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

  private canUserCreateSiteOwner(createSiteOwnerDto: CreateSiteOwnerDto) {
    const { companyId: siteOwnerCompanyId } = createSiteOwnerDto;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.belongsToCompany(siteOwnerCompanyId);
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
      case Resource.SITE_OWNER:
        return await this.canUserReadSiteOwner(resourceId);
      case Resource.SECURITY_GUARD:
        return this.canUserReadSecurityGuard(resourceId);
      case Resource.SITE:
        return this.canUserReadSite(resourceId);
      case Resource.NOTIFICATION:
        return this.canUserReadNotifications();
      case Resource.TAG:
        return this.canUserReadTags();
      case Resource.PATROL:
        return this.canUserReadPatrols();
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
      isOthersAllowed &&= await this.verifyResourceItemOwnership(
        Resource.COMPANY,
        companyId,
      );
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private async canUserReadCompanyAdmin(companyAdminId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed && companyAdminId) {
      isCompanyAdminAllowed &&= await this.verifyResourceItemOwnership(
        Resource.COMPANY_ADMIN,
        companyAdminId,
      );
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserReadSiteAdmin(siteAdminId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed && siteAdminId) {
      isCompanyAdminAllowed &&= await this.verifyResourceItemOwnership(
        Resource.SITE_ADMIN,
        siteAdminId,
      );
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserReadSiteOwner(siteOwnerId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();
    if (isCompanyAdminAllowed && siteOwnerId) {
      isCompanyAdminAllowed &&= await this.verifyResourceItemOwnership(
        Resource.SITE_OWNER,
        siteOwnerId,
      );
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserReadSecurityGuard(securityGuardId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed = this.user.isCompanyAdmin() || this.user.isSiteAdmin();
    if (isOthersAllowed && securityGuardId) {
      isOthersAllowed &&= await this.verifyResourceItemOwnership(
        Resource.SECURITY_GUARD,
        securityGuardId,
      );
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private async canUserReadSite(siteId?: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isOthersAllowed =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSiteOwner();
    if (isOthersAllowed && siteId) {
      isOthersAllowed &&= await this.verifyResourceItemOwnership(
        Resource.SITE,
        siteId,
      );
    }
    return isSuperAdminAllowed || isOthersAllowed;
  }

  /**
   * Notifications, Tags, Stats, and Patrols are read as a collection but not as
   * a single entity by ID(It is why they define an ID parameter). Therefore,
   * It suffices to only check for the user's identity when verifying access control
   * for the these entities. And then within the respective services for these
   * entities, only objects to which the user has access to will be returned
   * from the database
   */
  private async canUserReadNotifications() {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isOthersAllowed =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSiteOwner();
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private async canUserReadTags() {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isOthersAllowed =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSiteOwner();
    return isSuperAdminAllowed || isOthersAllowed;
  }

  private canUserReadStats() {
    return this.user.isSuperAdmin();
  }

  private async canUserReadPatrols() {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isOthersAllowed =
      this.user.isCompanyAdmin() ||
      this.user.isSiteAdmin() ||
      this.user.isSiteOwner();
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
      case Resource.SITE_OWNER:
        return this.canUserUpdateSiteOwner(
          resourceId as number,
          updateDto as UpdateSiteOwnerDto,
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
    const isUpdatingEmail = email !== undefined;
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      this.user.id === companyAdminId &&
      !isUpdatingEmail;
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

  private async canUserUpdateSiteOwner(
    siteOwnerId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSiteOwnerDto: UpdateSiteOwnerDto,
  ) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(
        Resource.SITE_OWNER,
        siteOwnerId,
      ));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateSecurityGuard(
    securityGuardId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDto: UpdateSecurityGuardDto,
  ) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(
        Resource.SECURITY_GUARD,
        securityGuardId,
      ));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateSite(
    siteId: number,
    updateSiteDto: UpdateSiteDto,
  ) {
    const { notificationsEnabled } = updateSiteDto;
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    // Company admins aren't allowed to toggle site notifications
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      notificationsEnabled === undefined &&
      (await this.verifyResourceItemOwnership(Resource.SITE, siteId));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserUpdateTags(
    tagId: number | undefined,
    updateDto: UpdateTagUIDDto | TagsActionDto,
  ) {
    /* TagsActionDto doesn't use a tagId(DB Primary Key),
    the tag Ids are embedded in the updateDto, on the other hand,
    UpdateTagUIDDto requires a tagId. */
    const isUpdatingTagUID = updateDto instanceof UpdateTagUIDDto && !!tagId;

    const isSuperAdminAllowed = this.user.isSuperAdmin();
    let isCompanyAdminAllowed = this.user.isCompanyAdmin();

    const { companyId: userCompanyId } = this.user;
    if (isCompanyAdminAllowed && isUpdatingTagUID) {
      const isTagOwner = await this.verifyResourceItemOwnership(
        Resource.TAG,
        tagId,
      );
      isCompanyAdminAllowed &&= isTagOwner;
    } else if (isCompanyAdminAllowed && updateDto instanceof TagsActionDto) {
      const { tags }: { tags: Tag[] } = updateDto as any;
      const isTagsOwner = tags.every((tag) =>
        tag.belongsToCompany(userCompanyId),
      );
      isCompanyAdminAllowed &&= isTagsOwner;
      const { type } = updateDto;
      const isInstallingTags = type === INSTALL_TAGS_ACTION;
      if (isInstallingTags) {
        const { site }: { site: Site } = updateDto as any;
        const siteBelongsToUserCompany = site.belongsToCompany(userCompanyId);
        isCompanyAdminAllowed &&= siteBelongsToUserCompany;
      }
    }
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  // Determine if a user can delete a resource
  async delete(
    resource: Resource,
    resourceId: number,
    { throwError = false } = {},
  ) {
    this.handleUndefinedUser();
    const canDeleteResource = await this.handleDeletePermissions(
      resource,
      resourceId,
    );
    if (throwError) throw new ForbiddenException();
    return canDeleteResource;
  }

  private async handleDeletePermissions(
    resource: Resource,
    resourceId: number,
  ) {
    switch (resource) {
      case Resource.SUPER_ADMIN:
        return this.canUserDeleteSuperAdmin(resourceId);
      case Resource.COMPANY:
        return this.canUserDeleteCompany();
      case Resource.COMPANY_ADMIN:
        return this.canUserDeleteCompanyAdmin();
      case Resource.SITE_ADMIN:
        return await this.canUserDeleteSiteAdmin(resourceId);
      case Resource.SITE_OWNER:
        return await this.canUserDeleteSiteOwner(resourceId);
      case Resource.SECURITY_GUARD:
        return this.canUserDeleteSecurityGuard(resourceId);
      case Resource.SITE:
        return this.canUserDeleteSite(resourceId);
      case Resource.TAG:
        return this.canUserDeleteTag(resourceId);
      case Resource.PATROL:
        return this.canUserDeletePatrol(resourceId);
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

  private async canUserDeleteSiteAdmin(siteAdminId: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(
        Resource.SITE_ADMIN,
        siteAdminId,
      ));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteSiteOwner(siteOwnerId: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(
        Resource.SITE_OWNER,
        siteOwnerId,
      ));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteSecurityGuard(securityGuardId: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(
        Resource.SECURITY_GUARD,
        securityGuardId,
      ));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteSite(siteId: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(Resource.SITE, siteId));
    return isSuperAdminAllowed || isCompanyAdminAllowed;
  }

  private async canUserDeleteTag(tagId: number) {
    const isSuperAdminAllowed = this.user.isSuperAdmin();
    const isCompanyAdminAllowed =
      this.user.isCompanyAdmin() &&
      (await this.verifyResourceItemOwnership(Resource.TAG, tagId));
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
      case Resource.SITE_OWNER:
        return await this.canUserFilterOnCompany(filter);
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
      canFilterOnCompanies = await this.verifyResourceItemOwnership(
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

  /**
   * Ownership doesn't mean a user has full access(CRUD) to a resource item.
   * Identity of the user plays part in determining the allowed actions on a
   * given resource. Don't only rely on this function to verify permissions
   */
  private async verifyResourceItemOwnership(
    resource: Resource,
    resourceId: number,
  ) {
    const { id: userId } = this.user as any;

    switch (resource) {
      case Resource.SUPER_ADMIN:
        return userId === resourceId;
      case Resource.COMPANY:
        return this.checkCompanyOwnership(resourceId);
      case Resource.COMPANY_ADMIN:
        return this.checkCompanyAdminOwnership(resourceId);
      case Resource.SITE_ADMIN:
        return await this.checkSiteAdminOwnership(resourceId);
      case Resource.SITE_OWNER:
        return await this.checkSiteOwnerOwnerShip(resourceId);
      case Resource.SECURITY_GUARD:
        return this.checkSecurityGuardOwnership(resourceId);
      case Resource.SITE:
        return await this.checkSiteOwnership(resourceId);
      default:
        return false;
    }
  }

  private checkCompanyOwnership(companyId: number) {
    if (this.verifyGlobalOwnership(Resource.COMPANY)) return true;
    const { companyId: userCompanyId } = this.user;
    return userCompanyId === companyId;
  }

  private checkCompanyAdminOwnership(companyAdminId: number) {
    if (this.verifyGlobalOwnership(Resource.COMPANY_ADMIN)) return true;

    const { id: userId, role } = this.user as any;
    switch (role) {
      case Role.COMPANY_ADMIN:
        return userId === companyAdminId;
      default:
        return false;
    }
  }

  private async checkSiteAdminOwnership(siteAdminId: number) {
    if (this.verifyGlobalOwnership(Resource.SITE_ADMIN)) return true;

    const { role, companyId: userCompanyId, id: userId } = this.user;
    switch (role) {
      case Role.COMPANY_ADMIN:
        return await this.userBelongsToCompany(
          siteAdminId,
          userCompanyId,
          Role.SITE_ADMIN,
        );
      case Role.SITE_ADMIN:
        return userId === siteAdminId;
      default:
        return false;
    }
  }

  private async checkSiteOwnerOwnerShip(siteOwnerId: number) {
    if (this.verifyGlobalOwnership(Resource.SITE_OWNER)) return true;

    const { role, id: userId, companyId: userCompanyId } = this.user;
    switch (role) {
      case Role.COMPANY_ADMIN:
        return await this.userBelongsToCompany(
          siteOwnerId,
          userCompanyId,
          Role.SITE_OWNER,
        );
      case Role.SITE_OWNER:
        return userId === siteOwnerId;
      default:
        return false;
    }
  }

  private async checkSecurityGuardOwnership(securityGuardId: number) {
    if (this.verifyGlobalOwnership(Resource.SECURITY_GUARD)) return true;

    const { role, companyId: userCompanyId } = this.user;
    switch (role) {
      case Role.COMPANY_ADMIN:
        return await this.userBelongsToCompany(
          securityGuardId,
          userCompanyId,
          Role.SECURITY_GUARD,
        );
      case Role.SITE_ADMIN:
        return await this.userBelongsToCompany(
          securityGuardId,
          userCompanyId,
          Role.SECURITY_GUARD,
        );
      default:
        return false;
    }
  }
  private async checkSiteOwnership(siteId: number) {
    if (this.verifyGlobalOwnership(Resource.SITE)) return true;

    const { role, companyId: userCompanyId, id: userId } = this.user;
    const { managedSiteId } = this.user as any;
    switch (role) {
      case Role.COMPANY_ADMIN:
        return await this.siteBelongsToCompany(siteId, userCompanyId);
      case Role.SITE_ADMIN:
        return managedSiteId === siteId;
      case Role.SITE_OWNER:
        return await this.isSiteOwnedByUser(siteId, userId);
      default:
        return false;
    }
  }

  private verifyGlobalOwnership(resource: Resource) {
    // Super Admins can read any resource except for other fellow super admins
    if (this.user.isSuperAdmin() && resource !== Resource.SUPER_ADMIN)
      return true;
  }

  async siteBelongsToCompany(siteId: number, companyId: number) {
    const site = await this.siteRepository.findOneBy({ id: siteId, companyId });
    return !!site;
  }

  async sitesBelongToCompany(siteIds: number[], companyId: number) {
    const sites = await this.siteRepository.find({
      where: { id: In(siteIds), companyId },
    });
    return sites.length === siteIds.length;
  }

  // The user's role helps in determining the table in which to find the user(s)
  async userBelongsToCompany(userId: number, companyId: number, role: Role) {
    const whereOptions = { userId, companyId };
    switch (role) {
      case Role.SUPER_ADMIN:
        return false;
      case Role.COMPANY_ADMIN:
        return !!(await this.companyAdminRepository.findOneBy(whereOptions));
      case Role.SITE_ADMIN:
        return !!(await this.siteAdminRepository.findOneBy(whereOptions));
      case Role.SITE_OWNER:
        return !!(await this.siteOwnerRepository.findOneBy(whereOptions));
      case Role.SECURITY_GUARD:
        return !!(await this.securityGuardRepository.findOneBy(whereOptions));
      default:
        return false;
    }
  }

  private async isSiteOwnedByUser(siteId: number, userId: number) {
    return !!(await this.siteRepository.findOneBy({
      id: siteId,
      ownerId: userId,
    }));
  }
}
