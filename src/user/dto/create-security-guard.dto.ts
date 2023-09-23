import { IsBoolean, IsIn, IsISO8601 } from 'class-validator';
import { GENDER_OPTIONS } from '../constants';
import { CreateUserDto } from './create-user.base.dto';

export class CreateSecurityGuardDto extends CreateUserDto {
  @IsIn(GENDER_OPTIONS)
  gender: string;

  @IsISO8601()
  dateOfBirth: string;

  @IsBoolean()
  armedStatus: boolean;
}
