import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired, User } from '../auth/auth.decorators';
import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SITE_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { PATROL_RESOURCE, SITE_RESOURCE } from '../permissions/permissions';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { AlsoAllow, DisAllow } from '../roles/roles.decorators';

@ApiTags('Sites')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @CanCreate(SITE_RESOURCE)
  create(
    @Body() createSiteDto: CreateSiteDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return this.siteService.create(createSiteDto);
  }

  @Get()
  @DisAllow(COMPANY_ADMIN_ROLE)
  @CanRead(SITE_RESOURCE)
  findAll(@Paginate() query: PaginateQuery) {
    return this.siteService.findAll(query);
  }

  @Get(':id')
  @AlsoAllow(SITE_ADMIN_ROLE, SECURITY_GUARD_ROLE)
  @CanRead(SITE_RESOURCE)
  findOne(@Param('id') id: string) {
    return this.siteService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(SITE_RESOURCE)
  async update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    await this.siteService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  @CanDelete(SITE_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.siteService.remove(+id);
  }

  @Get(':id/patrols')
  @AlsoAllow(SITE_ADMIN_ROLE)
  @CanRead(SITE_RESOURCE, PATROL_RESOURCE)
  async findAllSitePatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
    @User() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return await this.siteService.findAllSitePatrols(+id, query);
  }
}
