import { IsAlpha, IsPhoneNumber, MaxLength, Validate } from 'class-validator';
import { MAX_NAME_LENGTH } from '../user.constants';
import { HasStrongPasswordQualities } from '../user.validators';
import { IsUnique } from '../../core/core.validators';
import { User } from '../entities/user.base.entity';

export class CreateUserDto {
  @IsAlpha()
  @MaxLength(MAX_NAME_LENGTH)
  firstName: string;

  @IsAlpha()
  @MaxLength(MAX_NAME_LENGTH)
  lastName: string;

  @IsPhoneNumber('UG')
  @Validate(IsUnique, [User])
  phoneNumber: string;

  @HasStrongPasswordQualities()
  password: string;
}
