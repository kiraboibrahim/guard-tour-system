import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsString, ValidateIf } from 'class-validator';
import { INSTALL_TAGS_ACTION, UNINSTALL_TAGS_ACTION } from '../tag.constants';
import {
  LoadEntitiesIfExist,
  LoadEntityIfExists,
} from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';
import { Tag } from '../entities/tag.entity';

export class TagsActionDto {
  @ApiProperty()
  @IsIn([INSTALL_TAGS_ACTION, UNINSTALL_TAGS_ACTION])
  type: string;

  @ApiProperty()
  @ValidateIf((object) => object.type === INSTALL_TAGS_ACTION)
  @LoadEntityIfExists<Site>(Site, 'site', 'id', { tags: true })
  @IsInt()
  siteId: number;

  @ApiProperty()
  @LoadEntitiesIfExist<Tag>(Tag, 'tags', 'id')
  @IsInt({ each: true })
  tagIds: number[];
}
