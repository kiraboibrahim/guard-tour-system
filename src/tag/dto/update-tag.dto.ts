import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTagsDto } from './create-tags.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsTenDigitString,
  IsUnique,
  LoadEntitiesIfExist,
  LoadEntityIfExists,
} from '../../core/core.validators';
import { Tag } from '../entities/tag.entity';
import { IsInt } from 'class-validator';
import { Site } from '../../site/entities/site.entity';

export class UpdateTagDto extends PartialType(
  OmitType(CreateTagsDto, ['companyId', 'UIDs'] as const),
) {
  @ApiProperty()
  @IsUnique<Tag>(Tag, 'uid')
  @IsTenDigitString()
  UID: string;
}

export class InstallTagsToSiteDto {
  @ApiProperty()
  @LoadEntityIfExists<Site>(Site, 'site')
  @IsInt()
  siteId: number;

  @ApiProperty()
  @LoadEntitiesIfExist<Tag>(Tag, 'tags', 'id')
  @IsInt({ each: true })
  tagIDs: number[];
}

export class UninstallTagsFromSiteDto {
  @ApiProperty()
  @LoadEntitiesIfExist<Tag>(Tag, 'tags', 'id')
  @IsInt({ each: true })
  tagIDs: number[];
}
