import {
  IsIn,
  IsStrongPassword as _IsStrongPassword,
  Matches,
} from 'class-validator';
import {
  GENDER_OPTIONS,
  MIN_LOWERCASE_IN_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_SYMBOLS_IN_PASSWORD,
  MIN_UPPERCASE_IN_PASSWORD,
} from './user.constants';
import { IsUnique } from '../core/core.validators';
import { User } from './entities/user.base.entity';
import { SiteAdmin } from './entities/site-admin.entity';

export const IsStrongPassword = () => {
  const password_requirements = {
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE_IN_PASSWORD,
    minUppercase: MIN_UPPERCASE_IN_PASSWORD,
    minSymbols: MIN_SYMBOLS_IN_PASSWORD,
  };
  return _IsStrongPassword(password_requirements);
};

export const IsMaleOrFemale = () => {
  return IsIn(GENDER_OPTIONS);
};
