import { IsNotEmpty, Validate } from 'class-validator';
import { IsUnique } from '../../core/core.validators';
import { Company } from '../entities/company.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @Validate(IsUnique, [Company])
  @IsNotEmpty()
  registrationNumber: string;

  @IsNotEmpty()
  address: string;
}
