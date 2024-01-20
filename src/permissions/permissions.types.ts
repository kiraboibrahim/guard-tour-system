import { CreateSuperAdminDto } from '../user/dto/create-super-admin.dto';
import { Resource, Action } from './permissions';
import { CreateCompanyAdminDto } from '../user/dto/create-company-admin.dto';
import { CreateSiteAdminDto } from '../user/dto/create-site-admin.dto';
import { CreateSecurityGuardDto } from '../user/dto/create-security-guard.dto';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { CreateSiteDto } from '../site/dto/create-site.dto';
import { CreateTagsDto } from '../tag/dto/create-tags.dto';
import { CreatePatrolDto } from '../patrol/dto/create-patrol.dto';
import { UpdateCompanyDto } from '../company/dto/update-company.dto';
import { UpdateSuperAdminDto } from '../user/dto/update-super-admin.dto';
import { UpdateCompanyAdminDto } from '../user/dto/update-company-admin.dto';
import { UpdateSiteAdminDto } from '../user/dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../user/dto/update-security-guard.dto';
import { UpdateSiteDto } from '../site/dto/update-site.dto';
import { UpdateTagUIDDto } from '../tag/dto/update-tag-uid.dto';

export type ResourcesParams = {
  [key in Resource]?: string;
};

export type Permission = {
  action: Action;
  resource: Resource;
  parentResources?: Resource[];
  resourcesParams?: ResourcesParams;
};

export type CreateDto =
  | CreateSuperAdminDto
  | CreateCompanyDto
  | CreateCompanyAdminDto
  | CreateSiteAdminDto
  | CreateSecurityGuardDto
  | CreateSiteDto
  | CreateTagsDto
  | CreatePatrolDto;

export type UpdateDto =
  | UpdateSuperAdminDto
  | UpdateCompanyDto
  | UpdateCompanyAdminDto
  | UpdateSiteAdminDto
  | UpdateSecurityGuardDto
  | UpdateSiteDto
  | UpdateTagUIDDto;
