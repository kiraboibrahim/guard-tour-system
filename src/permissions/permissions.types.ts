import { CreateSuperAdminDto } from '@super-admin/dto/create-super-admin.dto';
import { Action } from './permissions.constants';
import { CreateCompanyAdminDto } from '@company-admin/dto/create-company-admin.dto';
import { CreateSiteAdminDto } from '@site-admin/dto/create-site-admin.dto';
import { CreateSecurityGuardDto } from '@security-guard/dto/create-security-guard.dto';
import { CreateCompanyDto } from '@company/dto/create-company.dto';
import { CreateSiteDto } from '@site/dto/create-site.dto';
import { CreateTagsDto } from '@tag/dto/create-tags.dto';
import { CreatePatrolDto } from '@patrol/dto/create-patrol.dto';
import { UpdateCompanyDto } from '@company/dto/update-company.dto';
import { UpdateSuperAdminDto } from '@super-admin/dto/update-super-admin.dto';
import { UpdateCompanyAdminDto } from '@company-admin/dto/update-company-admin.dto';
import { UpdateSiteAdminDto } from '@site-admin/dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '@security-guard/dto/update-security-guard.dto';
import { UpdateSiteDto } from '@site/dto/update-site.dto';
import { UpdateTagUIDDto } from '@tag/dto/update-tag-uid.dto';
import { Resource } from '@core/core.constants';
import { CreateShiftDto } from '@shift/dto/create-shift.dto';

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
  | CreateShiftDto
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
