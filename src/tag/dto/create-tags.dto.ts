import { IsInt } from 'class-validator';
import {
  AreTenDigitStrings,
  AreUnique,
  LoadEntityIfExists,
} from '../../core/core.validators';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';
import { Tag } from '../entities/tag.entity';
import { Site } from '../../site/entities/site.entity';

export class CreateTagsDto {
  @ApiProperty()
  @AreUnique<Tag>(Tag, 'uid')
  @AreTenDigitStrings()
  UIDs: string[];

  @ApiProperty()
  @LoadEntityIfExists<Site>(Site, 'site')
  @IsInt()
  siteId: number;

  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  @IsInt()
  companyId: number;
}
