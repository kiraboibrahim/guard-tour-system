import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Validate,
} from 'class-validator';
import { IsExistsAndLoadEntity } from '../../core/core.validators';
import { Site } from '../../site/entities/site.entity';

export class CreateDeviceDto {
  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  partNumber: string;

  @IsNotEmpty()
  IMEI: string;

  @IsPhoneNumber('UG')
  phoneNumber: string;

  @IsNotEmpty()
  simId: string;

  @IsOptional()
  @Validate(IsExistsAndLoadEntity, [Site, 'site'])
  @IsInt()
  siteId: number;
}
