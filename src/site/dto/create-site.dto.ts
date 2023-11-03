import { IsValidPatrolPlanType } from '../../patrol-plan/patrol-plan.validators';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';
import {
  IsExistsAndLoadEntity,
  IsUGPhoneNumber,
} from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsValidPatrolPlanType()
  patrolPlanType: string;

  @ApiProperty()
  @IsExistsAndLoadEntity(Company, 'company')
  companyId: number;
}
