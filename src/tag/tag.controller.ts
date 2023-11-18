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
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
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

@ApiTags('Devices')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  @CanCreate(TAG_RESOURCE)
  create(@Body() createTagDto: CreateTagDto, @User() user: AuthenticatedUser) {
    this.tagService.setUser(user);
    return this.tagService.create(createTagDto);
  }

  @ApiPaginationQuery(TAG_PAGINATION_CONFIG)
  @Get()
  @DisAllow(COMPANY_ADMIN_ROLE)
  @CanRead(TAG_RESOURCE)
  findAll(@Paginate() query: PaginateQuery) {
    return this.tagService.findAll(query);
  }

  @Get(':id')
  @CanRead(TAG_RESOURCE)
  findOne(@Param('id') id: string) {
    return this.tagService.findOneById(+id);
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
