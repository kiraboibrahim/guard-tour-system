import {
  IsAlpha,
  IsPhoneNumber,
  MaxLength,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import {
  MIN_LOWERCASE_IN_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_UPPERCASE_IN_PASSWORD,
  MIN_SYMBOLS_IN_PASSWORD,
  MAX_NAME_LENGTH,
} from '../constants';

export class CreateUserDto {
  @IsAlpha()
  @MaxLength(MAX_NAME_LENGTH)
  firstName: string;

  @IsAlpha()
  @MaxLength(MAX_NAME_LENGTH)
  lastName: string;

  @IsPhoneNumber('UG')
  phoneNumber: string;

  @IsStrongPassword({
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE_IN_PASSWORD,
    minUppercase: MIN_UPPERCASE_IN_PASSWORD,
    minSymbols: MIN_SYMBOLS_IN_PASSWORD,
  })
  password: string;

  @ValidateIf((obj) => obj.password === obj.passwordConfirmation)
  passwordConfirmation: string;
}
