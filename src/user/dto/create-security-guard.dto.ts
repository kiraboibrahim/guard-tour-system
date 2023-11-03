import { IsBoolean, IsInt, IsISO8601, Matches } from 'class-validator';
import {
  IsValidGender,
  IsValidSecurityGuardUniqueId,
} from '../user.validators';
import { CreateUserDto } from './create-user.base.dto';
import {
  IsExistsAndLoadEntity,
  IsConsentingAdult,
  IsUnique,
} from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { SecurityGuard } from '../entities/security-guard.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSecurityGuardDto extends CreateUserDto {
  @ApiProperty()
  @IsExistsAndLoadEntity(Company, 'company')
  @IsInt()
  companyId: number;

  @ApiProperty()
  @IsUnique(SecurityGuard)
  @IsValidSecurityGuardUniqueId()
  uniqueId: string; // Security Guard Username

  @ApiProperty()
  @IsValidGender()
  gender: string;

  @ApiProperty()
  @IsConsentingAdult()
  dateOfBirth: string;

  @ApiProperty()
  @IsBoolean()
  armedStatus: boolean;
}
