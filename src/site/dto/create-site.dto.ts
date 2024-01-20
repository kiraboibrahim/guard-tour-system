import { IsInt, IsLatitude, IsLongitude, IsString } from 'class-validator';
import {
  LoadEntityIfExists,
  IsUGPhoneNumber,
  IsUnique,
} from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Site } from '../entities/site.entity';

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
  @IsUGPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  supervisorName: string;

  @ApiProperty()
  @IsUGPhoneNumber()
  supervisorPhoneNumber: string;

  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  @IsInt()
  companyId: number;
}
