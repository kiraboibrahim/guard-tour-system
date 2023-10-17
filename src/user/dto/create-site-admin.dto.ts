import { IsEmail, Validate } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';
import { IsExistsAndLoadEntity, IsUnique } from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { Site } from '../../site/entities/site.entity';
import { SiteAdmin } from '../entities/site-admin.entity';

export class CreateSiteAdminDto extends CreateUserDto {
  @Validate(IsExistsAndLoadEntity, [Company, 'company'])
  companyId: number;

  @Validate(IsExistsAndLoadEntity, [Site, 'site'])
  siteId: number;

  @IsEmail()
  @Validate(IsUnique, [SiteAdmin])
  email: string;
}
