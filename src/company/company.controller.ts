import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { COMPANY_PAGINATION_CONFIG } from './company-pagination.config';
import { SITE_PAGINATION_CONFIG } from '../site/site-pagination.config';
import { SECURITY_GUARD_PAGINATION_CONFIG } from '../user/pagination-config/security-guard-pagination.config';
import { COMPANY_ADMIN_ROLE, SUPER_ADMIN_ROLE } from '../roles/roles.constants';
import { AuthRequired } from '../auth/auth.decorators';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import {
  COMPANY_RESOURCE,
  SECURITY_GUARD_RESOURCE,
  SITE_ADMIN_RESOURCE,
  SITE_RESOURCE,
  TAG_RESOURCE,
} from '../permissions/permissions';
import { AlsoAllow } from '../roles/roles.decorators';
import { TAG_PAGINATION_CONFIG } from '../tag/tag-pagination.config';

@ApiTags('Companies')
@AuthRequired(SUPER_ADMIN_ROLE)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @CanCreate(COMPANY_RESOURCE)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  @Get()
  @CanRead(COMPANY_RESOURCE)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.companyService.findAll(query);
  }

  @Get(':id')
  @AlsoAllow(COMPANY_ADMIN_ROLE)
  @CanRead(COMPANY_RESOURCE)
  async findOne(@Param('id') id: string) {
    return await this.companyService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(COMPANY_RESOURCE)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @CanDelete(COMPANY_RESOURCE)
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @ApiPaginationQuery(SITE_PAGINATION_CONFIG)
  @Get(':id/sites')
  @AlsoAllow(COMPANY_ADMIN_ROLE)
  @CanRead(COMPANY_RESOURCE, SITE_RESOURCE)
  async findAllCompanySites(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.companyService.findAllCompanySites(+id, query);
  }

  @ApiPaginationQuery(SECURITY_GUARD_PAGINATION_CONFIG)
  @Get(':id/security-guards')
  @AlsoAllow(COMPANY_ADMIN_ROLE)
  @CanRead(COMPANY_RESOURCE, SECURITY_GUARD_RESOURCE)
  async findAllCompanySecurityGuards(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.companyService.findAllCompanySecurityGuards(+id, query);
  }

  @ApiPaginationQuery(TAG_PAGINATION_CONFIG)
  @Get(':id/tags')
  @AlsoAllow(COMPANY_ADMIN_ROLE)
  @CanRead(COMPANY_RESOURCE, TAG_RESOURCE)
  async findAllCompanyTags(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.companyService.findAllCompanyTags(+id, query);
  }

  @ApiPaginationQuery(SITE_PAGINATION_CONFIG)
  @Get(':id/site-admins')
  @AlsoAllow(COMPANY_ADMIN_ROLE)
  @CanRead(COMPANY_RESOURCE, SITE_ADMIN_RESOURCE)
  async findAllCompanySiteAdmins(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.companyService.findAllCompanySiteAdmins(+id, query);
  }
}
