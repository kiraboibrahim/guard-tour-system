import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SiteOwnerService } from './site-owner.service';
import { CreateSiteOwnerDto } from './dto/create-site-owner.dto';
import { UpdateSiteOwnerDto } from './dto/update-site-owner.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Auth, User } from '../auth/auth.decorators';
import { Role } from '../roles/roles';
import { AlsoAllow } from '../roles/roles.decorators';
import { ApiTags } from '@nestjs/swagger';
import { SITE_OWNER_PAGINATION_CONFIG } from './site-owner.pagination';
import { User as AuthenticatedUser } from '../auth/auth.types';

import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { Resource } from '../permissions/permissions.constants';

@Controller('users/site-owners')
@ApiTags('Site Owner')
@Auth(Role.SUPER_ADMIN)
export class SiteOwnerController {
  constructor(private readonly siteOwnerService: SiteOwnerService) {}

  @Post()
  @CanCreate(Resource.SITE_OWNER)
  create(
    @Body() createSiteOwnerDto: CreateSiteOwnerDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteOwnerService.setUser(user);
    return this.siteOwnerService.create(createSiteOwnerDto);
  }

  @Get()
  @CanRead(Resource.SITE_OWNER)
  @ApiPaginationQuery(SITE_OWNER_PAGINATION_CONFIG)
  findAll(@Paginate() query: PaginateQuery, @User() user: AuthenticatedUser) {
    this.siteOwnerService.setUser(user);
    return this.siteOwnerService.findAll(query);
  }

  @Get(':id')
  @AlsoAllow(Role.SITE_OWNER)
  @CanRead(Resource.SITE_OWNER)
  findOne(@Param('id') id: string) {
    return this.siteOwnerService.findOne(+id);
  }

  @Patch(':id')
  @CanUpdate(Resource.SITE_OWNER)
  update(
    @Param('id') id: string,
    @Body() updateSiteOwnerDto: UpdateSiteOwnerDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteOwnerService.setUser(user);
    return this.siteOwnerService.update(+id, updateSiteOwnerDto);
  }

  @Delete(':id')
  @CanDelete(Resource.SITE_OWNER)
  remove(@Param('id') id: string) {
    return this.siteOwnerService.remove(+id);
  }
}
