import { IsInt } from 'class-validator';
import { IsExistsAndLoadEntity, IsUnique } from '../../core/core.validators';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';
import { Tag } from '../entities/tag.entity';

export class CreateTagDto {
  @ApiProperty()
  @IsUnique(Tag)
  uid: string;

  @ApiProperty()
  @IsExistsAndLoadEntity(Company, 'company')
  @IsInt()
  companyId: number;
}
