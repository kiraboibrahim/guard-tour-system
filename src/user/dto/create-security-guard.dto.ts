import {
  IsBoolean,
  IsInt,
  IsISO8601,
  Matches,
  Validate,
} from 'class-validator';
import { IsValidGender } from '../user.validators';
import { CreateUserDto } from './create-user.base.dto';
import {
  IsExistsAndLoadEntity,
  IsAtleastXYears,
  IsExists,
  IsUnique,
} from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { TEN_DIGIT_NUMBER_REGEXP } from '../user.constants';
import { SecurityGuard } from '../entities/security-guard.entity';

export class CreateSecurityGuardDto extends CreateUserDto {
  @IsInt()
  @Validate(IsExistsAndLoadEntity, [Company, 'company'])
  companyId: number;

  @Matches(TEN_DIGIT_NUMBER_REGEXP)
  @Validate(IsUnique, [SecurityGuard])
  uniqueId: string; // Security Guard Username

  @IsValidGender()
  gender: string;

  @Validate(IsAtleastXYears, [18])
  @IsISO8601()
  dateOfBirth: string;

  @IsBoolean()
  armedStatus: boolean;
}
