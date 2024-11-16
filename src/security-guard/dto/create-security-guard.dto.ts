import { IsIn, IsInt } from 'class-validator';
import { IsMaleOrFemale } from '@user/user.validators';
import { CreateNonAuthUserDto } from '@user/dto/create-user.base.dto';
import {
  LoadEntityIfExists,
  IsConsentingAdult,
  IsUnique,
} from '@core/core.validators';
import { Company } from '@company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SecurityGuard } from '../entities/security-guard.entity';
import { SECURITY_GUARD_TYPE } from '../security-guard.constants';

export class CreateSecurityGuardDto extends CreateNonAuthUserDto {
  @ApiProperty()
  @LoadEntityIfExists(Company, 'company')
  @IsInt()
  companyId: number;

  @ApiProperty()
  @IsUnique<SecurityGuard>(SecurityGuard, 'uniqueId')
  uniqueId: string;

  @ApiProperty()
  @IsMaleOrFemale()
  gender: string;

  @ApiProperty()
  @IsConsentingAdult()
  dateOfBirth: string;

  @ApiProperty()
  @IsIn([SECURITY_GUARD_TYPE.SUPERVISOR, SECURITY_GUARD_TYPE.FIELD])
  type: string;
}
