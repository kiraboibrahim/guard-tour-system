import { IsInt, IsLatitude, IsLongitude, IsString } from 'class-validator';
import {
  LoadEntityIfExists,
  IsUGPhoneNumber,
} from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPatrolType } from '../../patrol/patrol.validators';

export class CreateSiteDto {
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
  @IsUGPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  supervisorName: string;

  @ApiProperty()
  @IsUGPhoneNumber()
  supervisorPhoneNumber: string;

  @ApiProperty()
  @IsValidPatrolType()
  patrolType: string;

  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  @IsInt()
  companyId: number;
}
