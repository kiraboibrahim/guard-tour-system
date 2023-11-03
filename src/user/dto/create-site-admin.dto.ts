import { IsEmail, Validate } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';
import { IsExistsAndLoadEntity, IsUnique } from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { Site } from '../../site/entities/site.entity';
import { SiteAdmin } from '../entities/site-admin.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteAdminDto extends CreateUserDto {
  @ApiProperty()
  @Validate(IsExistsAndLoadEntity, [Company, 'company'])
  companyId: number;

  @ApiProperty()
  @IsExistsAndLoadEntity(Site, 'site')
  @IsUnique(SiteAdmin, 'siteId')
  siteId: number;

  @ApiProperty()
  @IsEmail()
  @IsUnique(SiteAdmin)
  email: string;
}
