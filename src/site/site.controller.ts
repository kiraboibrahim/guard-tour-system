import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { Auth, IsPublic, User } from '../auth/auth.decorators';
import { Role } from '../roles/roles';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { Resource } from '../permissions/permissions';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { AlsoAllow } from '../roles/roles.decorators';

@ApiTags('Sites')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @CanCreate(Resource.SITE)
  create(
    @Body() createSiteDto: CreateSiteDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return this.siteService.create(createSiteDto);
  }

  @Get()
  @CanRead(Resource.SITE)
  find(@Paginate() query: PaginateQuery, @User() user: AuthenticatedUser) {
    this.siteService.setUser(user);
    return this.siteService.find(query);
  }

  @Get(':id')
  @IsPublic()
  findOne(@Param('id') id: string) {
    return this.siteService.findOneById(id);
  }

  @Get(':id/patrols')
  @AlsoAllow(Role.SITE_ADMIN)
  @CanRead(Resource.PATROL, [Resource.SITE], { [Resource.SITE]: 'id' })
  @IsPublic()
  async findSitePatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.siteService.findSitePatrols(+id, query);
  }

  @Get(':id/notifications')
  @CanRead(Resource.NOTIFICATION, [Resource.SITE], { [Resource.SITE]: 'id' })
  async findSiteNotifications(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return this.siteService.findSiteNotifications(+id, query);
  }

  @Patch(':id')
  @CanUpdate(Resource.SITE)
  async update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @User() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return await this.siteService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  @CanDelete(Resource.SITE)
  async remove(@Param('id') id: string) {
    return await this.siteService.remove(+id);
  }
}
