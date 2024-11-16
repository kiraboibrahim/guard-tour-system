import { IsAlpha, IsEmail, MaxLength } from 'class-validator';
import { MAX_NAME_LENGTH } from '../user.constants';
import { IsStrongPassword } from '../user.validators';
import {
  IsUGPhoneNumber,
  IsUnique,
  LoadEntityIfExists,
} from '../../core/core.validators';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';

import { AuthUser } from '@user/entities/auth-user.base.entity';

// This DTO is used for creating non auth users, users that don't authenticate with the application
export class CreateNonAuthUserDto {
  @ApiProperty()
  @IsAlpha()
  @MaxLength(MAX_NAME_LENGTH)
  firstName: string;

  @ApiProperty()
  @IsAlpha()
  @MaxLength(MAX_NAME_LENGTH)
  lastName: string;

  @ApiProperty()
  @IsUGPhoneNumber()
  phoneNumber: string;
}

// This DTO is used for creating auth users, users that authenticate with the application
export class CreateAuthUserDto extends CreateNonAuthUserDto {
  @ApiProperty()
  @IsUnique<AuthUser>(AuthUser, 'email')
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}

/* This DTO is used for creating auth users(users that authenticate with the application)
but also associated with a company */
export class CreateAuthCompanyUserDto extends CreateAuthUserDto {
  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  companyId: number;
}
