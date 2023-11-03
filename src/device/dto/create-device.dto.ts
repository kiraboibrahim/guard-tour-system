import { IsInt, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  @IsNotEmpty()
  brand: string;

  @ApiProperty()
  @IsNotEmpty()
  serialNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  partNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  IMEI: string;

  @ApiProperty()
  @IsPhoneNumber('UG')
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  simId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsExistsAndLoadEntity(Site, 'site')
  @IsInt()
  siteId: number;
}
