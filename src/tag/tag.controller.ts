import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagsDto } from './dto/create-tags.dto';
import {
  UpdateTagDto,
  UninstallTagsFromSiteDto,
  InstallTagsToSiteDto,
} from './dto/update-tag.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { TAG_PAGINATION_CONFIG } from './tag-pagination.config';
import { COMPANY_ADMIN_ROLE, SUPER_ADMIN_ROLE } from '../roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { TAG_RESOURCE } from '../permissions/permissions';
import { AuthRequired, User as User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { DisAllow } from '../roles/roles.decorators';

@ApiTags('Tags')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  @CanCreate(TAG_RESOURCE)
  create(
    @Body() createTagsDto: CreateTagsDto,
    @User() user: AuthenticatedUser,
  ) {
    this.tagService.setUser(user);
    return this.tagService.create(createTagsDto);
  }

  @ApiPaginationQuery(TAG_PAGINATION_CONFIG)
  @Get()
  @DisAllow(COMPANY_ADMIN_ROLE)
  @CanRead(TAG_RESOURCE)
  findAll(@Paginate() query: PaginateQuery) {
    return this.tagService.findAll(query);
  }

  @Patch('install')
  @CanUpdate(TAG_RESOURCE)
  async uninstallTagsFromSite(
    @Body() installTagsToSiteDto: InstallTagsToSiteDto,
    @User() user: AuthenticatedUser,
  ) {
    this.tagService.setUser(user);
    await this.tagService.installTagsToSite(installTagsToSiteDto);
  }
  @Patch('uninstall')
  @CanUpdate(TAG_RESOURCE)
  async installTagsToSite(
    @Body() uninstallTagsFromSiteDto: UninstallTagsFromSiteDto,
    @User() user: AuthenticatedUser,
  ) {
    this.tagService.setUser(user);
    await this.tagService.uninstallTagsFromSite(uninstallTagsFromSiteDto);
  }
  @Patch(':id')
  @CanUpdate(TAG_RESOURCE)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    await this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @CanDelete(TAG_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.tagService.remove(+id);
  }
}
