import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteAdminService } from '../services/site-admin.service';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { SITE_ADMIN_PAGINATION_CONFIG } from '../pagination-config/site-admin-pagination.config';
import { AuthRequired, User } from '../../auth/auth.decorators';
import { User as AuthenticatedUser } from '../../auth/auth.types';
import {
  COMPANY_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../../roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../../permissions/permissions.decorators';
import { SITE_ADMIN_RESOURCE } from '../../permissions/permissions';
import { DisAllow } from '../../roles/roles.decorators';

@ApiTags('Site Admins')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('site-admins')
export class SiteAdminController {
  constructor(private readonly siteAdminService: SiteAdminService) {}

  @Post()
  @CanCreate(SITE_ADMIN_RESOURCE)
  create(
    @Body() createSiteAdminDto: CreateSiteAdminDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteAdminService.setUser(user);
    return this.siteAdminService.create(createSiteAdminDto);
  }

  @ApiPaginationQuery(SITE_ADMIN_PAGINATION_CONFIG)
  @Get()
  @DisAllow(COMPANY_ADMIN_ROLE)
  @CanRead(SITE_ADMIN_RESOURCE)
  findAll(@Paginate() query: PaginateQuery) {
    return this.siteAdminService.findAll(query);
  }

  @Get(':id')
  @CanRead(SITE_ADMIN_RESOURCE)
  findOne(@Param('id') id: string) {
    return this.siteAdminService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(SITE_ADMIN_RESOURCE)
  async update(
    @Param('id') id: string,
    @Body() updateSiteAdminDto: UpdateSiteAdminDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteAdminService.setUser(user);
    await this.siteAdminService.update(+id, updateSiteAdminDto);
  }

  @Delete(':id')
  @CanDelete(SITE_ADMIN_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.siteAdminService.remove(+id);
  }
}
