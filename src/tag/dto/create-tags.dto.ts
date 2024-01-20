import { IsInt, IsOptional, IsString } from 'class-validator';
import { AreUnique, LoadEntityIfExists } from '../../core/core.validators';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';
import { Tag } from '../entities/tag.entity';
import { Site } from '../../site/entities/site.entity';

export class CreateTagsDto {
  @ApiProperty()
  @AreUnique<Tag>(Tag, 'uid')
  @IsString({ each: true })
  UIDs: string[];

  @ApiProperty()
  @LoadEntityIfExists<Site>(Site, 'site', 'id', { tags: true })
  @IsInt()
  @IsOptional()
  siteId: number;

  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  @IsInt()
  companyId: number;
}
