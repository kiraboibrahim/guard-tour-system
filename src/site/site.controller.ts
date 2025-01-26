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
import { Auth, GetUser, IsPublic } from '@auth/auth.decorators';
import { Role } from '@roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '@permissions/permissions.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { AllowOnly, AlsoAllow } from '@roles/roles.decorators';
import { Resource } from '@core/core.constants';

@ApiTags('Sites')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @CanCreate(Resource.SITE)
  create(
    @Body() createSiteDto: CreateSiteDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return this.siteService.create(createSiteDto);
  }

  @Get()
  @AlsoAllow(Role.SITE_OWNER)
  @CanRead(Resource.SITE)
  find(@Paginate() query: PaginateQuery, @GetUser() user: AuthenticatedUser) {
    this.siteService.setUser(user);
    return this.siteService.find(query);
  }

  @Get(':id')
  @IsPublic()
  findOne(@Param('id') id: string) {
    return this.siteService.findOneById(id);
  }

  @Get(':id/patrols')
  @IsPublic()
  async findSitePatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.siteService.findSitePatrols(+id, query);
  }

  @CanRead(Resource.SITE)
  @Get(':id/shifts')
  async findSiteShifts(@Param('id') id: string) {
    return await this.siteService.findSiteShifts(+id);
  }

  @CanRead(Resource.SITE)
  @Get(':id/call-logs')
  async findSiteCallLogs(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.siteService.findSiteCallLogs(+id, query);
  }

  @Get(':id/notifications')
  @AlsoAllow(Role.SITE_OWNER)
  @CanRead(Resource.NOTIFICATION, [Resource.SITE], { [Resource.SITE]: 'id' })
  async findSiteNotifications(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return this.siteService.findSiteNotifications(+id, query);
  }

  @Get(':id/:year/:month/performance')
  @AllowOnly(Role.SUPER_ADMIN, Role.COMPANY_ADMIN, Role.SITE_OWNER)
  @CanRead(Resource.SITE)
  async findSitePerformance(
    @Param('id') id: string,
    @Param('month') month: string,
    @Param('year') year: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.siteService.setUser(user);
    return this.siteService.findSitePerformance(+id, year, month);
  }

  @Patch(':id')
  @CanUpdate(Resource.SITE)
  async update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @GetUser() user: AuthenticatedUser,
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
