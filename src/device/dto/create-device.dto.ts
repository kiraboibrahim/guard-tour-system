import { IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateDeviceDto {
  brand: string;

  serialNumber: string;

  partNumber: string;

  IMEI: string;

  @IsPhoneNumber('UG')
  phoneNumber: string;

  simId: string;

  @IsOptional()
  site: number;
}
