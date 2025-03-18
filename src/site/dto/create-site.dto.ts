import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  IsIn,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import {
  LoadEntityIfExists,
  IsUGPhoneNumber,
  IsUnique,
} from '@core/core.validators';
import { Company } from '@company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Site } from '../entities/site.entity';
import { MAX_PATROL_DELAY_DURATIONS, PATROL_TYPE } from '../site.constants';
import { SiteOwner } from '../../site-owner/entities/site-owner.entity';

export class CreateSiteDto {
  @ApiProperty()
  @IsUnique<Site>(Site, 'tagId')
  @IsString()
  tagId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsLatitude()
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @IsInt()
  requiredPatrolsPerGuard: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  notificationsEnabled: boolean;

  @ApiProperty()
  @IsIn(MAX_PATROL_DELAY_DURATIONS)
  @IsNumber()
  @IsOptional()
  notificationCycle: number;

  @ApiProperty()
  @IsIn([PATROL_TYPE.INDIVIDUAL, PATROL_TYPE.GROUP])
  @IsOptional({})
  patrolType: string;

  @ApiProperty()
  @IsUGPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @LoadEntityIfExists<SiteOwner>(SiteOwner, 'siteOwner', 'userId')
  @IsOptional()
  ownerId: number;

  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  @IsInt()
  companyId: number;
}
