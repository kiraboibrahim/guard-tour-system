import { IsEmail, IsInt } from 'class-validator';
import { CreateAuthUserDto } from '../../user/dto/create-user.base.dto';
import { IsUnique, LoadEntityIfExists } from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { Site } from '../../site/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from '../../user/entities/user.base.entity';
import { SiteAdmin } from '../entities/site-admin.entity';

export class CreateSiteAdminDto extends CreateAuthUserDto {
  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  @IsInt()
  companyId: number;

  @ApiProperty()
  @IsUnique<SiteAdmin>(SiteAdmin, 'siteId')
  @LoadEntityIfExists<Site>(Site, 'site')
  @IsInt()
  siteId: number;

  @ApiProperty()
  @IsUnique<AuthUser>(AuthUser, 'username')
  @IsEmail()
  email: string;
}
