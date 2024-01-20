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
import { UpdateTagUIDDto } from './dto/update-tag-uid.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { TAG_PAGINATION_CONFIG } from './tag-pagination.config';
import { Role } from '../roles/roles';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { Resource } from '../permissions/permissions';
import { Auth, User as User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { TagsActionDto } from './dto/tags-action.dto';

@ApiTags('Tags')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  @CanCreate(Resource.TAG)
  create(
    @Body() createTagsDto: CreateTagsDto,
    @User() user: AuthenticatedUser,
  ) {
    this.tagService.setUser(user);
    return this.tagService.create(createTagsDto);
  }

  @ApiPaginationQuery(TAG_PAGINATION_CONFIG)
  @Get()
  @CanRead(Resource.TAG)
  find(@Paginate() query: PaginateQuery, @User() user: AuthenticatedUser) {
    this.tagService.setUser(user);
    return this.tagService.find(query);
  }

  @Patch('actions')
  @CanUpdate(Resource.TAG)
  async handleTagsActions(
    @Body() tagsActionDto: TagsActionDto,
    @User() user: AuthenticatedUser,
  ) {
    this.tagService.setUser(user);
    return await this.tagService.handleTagsActions(tagsActionDto);
  }

  @Patch(':id')
  @CanUpdate(Resource.TAG)
  async updateTagUID(
    @Param('id') id: string,
    @Body() updateTagUIDDto: UpdateTagUIDDto,
    @User() user: AuthenticatedUser,
  ) {
    this.tagService.setUser(user);
    return await this.tagService.updateTagUID(+id, updateTagUIDDto);
  }

  @Delete(':id')
  @CanDelete(Resource.TAG)
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(+id);
  }
}
