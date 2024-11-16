import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteAdminService } from './site-admin.service';
import { CreateSiteAdminDto } from './dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from './dto/update-site-admin.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { SITE_ADMIN_PAGINATION_CONFIG } from './site-admin.pagination';
import { Auth, GetUser } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';

import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { Role } from '../roles/roles.constants';
import { Resource } from '@core/core.constants';

@ApiTags('Site Admins')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('users/site-admins')
export class SiteAdminController {
  constructor(private readonly siteAdminService: SiteAdminService) {}

  @Post()
  @CanCreate(Resource.SITE_ADMIN)
  create(
    @Body() createSiteAdminDto: CreateSiteAdminDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.siteAdminService.setUser(user);
    return this.siteAdminService.create(createSiteAdminDto);
  }

  @ApiPaginationQuery(SITE_ADMIN_PAGINATION_CONFIG)
  @Get()
  @CanRead(Resource.SITE_ADMIN)
  find(@Paginate() query: PaginateQuery, @GetUser() user: AuthenticatedUser) {
    this.siteAdminService.setUser(user);
    return this.siteAdminService.find(query);
  }

  @Get(':id')
  @CanRead(Resource.SITE_ADMIN, undefined, { [Resource.SITE_ADMIN]: 'id' })
  findOne(@Param('id') id: string) {
    return this.siteAdminService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(Resource.SITE_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSiteAdminDto: UpdateSiteAdminDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.siteAdminService.setUser(user);
    return await this.siteAdminService.update(+id, updateSiteAdminDto);
  }

  @Delete(':id')
  @CanDelete(Resource.SITE_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.siteAdminService.remove(+id);
  }
}
