import { IsIn, IsStrongPassword, Matches } from 'class-validator';
import {
  GENDER_OPTIONS,
  MIN_LOWERCASE_IN_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_SYMBOLS_IN_PASSWORD,
  MIN_UPPERCASE_IN_PASSWORD,
} from './user.constants';

export const HasStrongPasswordQualities = () => {
  const password_requirements = {
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE_IN_PASSWORD,
    minUppercase: MIN_UPPERCASE_IN_PASSWORD,
    minSymbols: MIN_SYMBOLS_IN_PASSWORD,
  };
  return IsStrongPassword(password_requirements);
};

export const IsValidGender = () => {
  return IsIn(GENDER_OPTIONS);
};

export const IsValidSecurityGuardUniqueId = () => {
  const TEN_DIGIT_NUMBER_REGEXP = new RegExp('[1-9][0-9]{9}');
  return Matches(TEN_DIGIT_NUMBER_REGEXP);
};
