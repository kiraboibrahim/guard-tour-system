import { IsNotEmpty } from 'class-validator';
import { IsUnique } from '../../core/core.validators';
import { Company } from '../entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUnique<Company>(Company, 'registrationNumber')
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;
}
