import { IsBoolean, IsInt } from 'class-validator';
import { IsMaleOrFemale } from '../user.validators';
import { CreateUserDto } from './create-user.base.dto';
import {
  LoadEntityIfExists,
  IsConsentingAdult,
  IsTenDigitString,
  IsUnique,
} from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SecurityGuard } from '../entities/security-guard.entity';

export class CreateSecurityGuardDto extends CreateUserDto {
  @ApiProperty()
  @LoadEntityIfExists(Company, 'company')
  @IsInt()
  companyId: number;

  @ApiProperty()
  @IsUnique<SecurityGuard>(SecurityGuard, 'uniqueId')
  @IsTenDigitString()
  uniqueId: string;

  @ApiProperty()
  @IsMaleOrFemale()
  gender: string;

  @ApiProperty()
  @IsConsentingAdult()
  dateOfBirth: string;

  @ApiProperty()
  @IsBoolean()
  armedStatus: boolean;
}
