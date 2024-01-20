import { IsIn, IsStrongPassword as _IsStrongPassword } from 'class-validator';
import {
  GENDER_OPTIONS,
  MIN_LOWERCASE_IN_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_SYMBOLS_IN_PASSWORD,
  MIN_UPPERCASE_IN_PASSWORD,
} from './user.constants';

export const IsStrongPassword = () => {
  const password_requirements = {
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE_IN_PASSWORD,
    minUppercase: MIN_UPPERCASE_IN_PASSWORD,
    minSymbols: MIN_SYMBOLS_IN_PASSWORD,
  };
  const message = `Password doesn't meet the requirements: atleast ${MIN_PASSWORD_LENGTH} characters long, atleast ${MIN_LOWERCASE_IN_PASSWORD} lowercase letters, atleast ${MIN_UPPERCASE_IN_PASSWORD} uppercase letters, atleast ${MIN_SYMBOLS_IN_PASSWORD} symbols`;
  return _IsStrongPassword(password_requirements, { message });
};

export const IsMaleOrFemale = () => {
  return IsIn(GENDER_OPTIONS);
};
