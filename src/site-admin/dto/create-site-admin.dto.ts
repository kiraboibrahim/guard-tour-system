import { IsInt } from 'class-validator';
import { CreateAuthCompanyUserDto } from '../../user/dto/create-user.base.dto';
import { IsUnique, LoadEntityIfExists } from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SiteAdmin } from '../entities/site-admin.entity';

export class CreateSiteAdminDto extends CreateAuthCompanyUserDto {
  @ApiProperty()
  @IsUnique<SiteAdmin>(SiteAdmin, 'siteId')
  @LoadEntityIfExists<Site>(Site, 'site')
  @IsInt()
  siteId: number;
}
