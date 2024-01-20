import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTagsDto } from './create-tags.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../core/core.validators';
import { Tag } from '../entities/tag.entity';
import { IsString } from 'class-validator';

export class UpdateTagUIDDto extends PartialType(
  OmitType(CreateTagsDto, ['companyId', 'UIDs'] as const),
) {
  @ApiProperty()
  @IsUnique<Tag>(Tag, 'uid')
  @IsString()
  UID: string;
}
