import { IsAlpha, MaxLength } from 'class-validator';
import { MAX_NAME_LENGTH } from '../user.constants';
import { IsStrongPassword } from '../user.validators';
import { IsUGPhoneNumber, IsUnique } from '../../core/core.validators';
import { AuthUser, User } from '../entities/user.base.entity';
import { ApiProperty } from '@nestjs/swagger';

// The user DTO that contains common fields for non-authenticated users
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
  @IsUnique<AuthUser>(AuthUser, 'phoneNumber')
  @IsUnique<User>(User, 'phoneNumber')
  @IsUGPhoneNumber()
  phoneNumber: string;
}

// A DTO that holds common fields for authenticated users
export class CreateAuthUserDto extends CreateNonAuthUserDto {
  @ApiProperty()
  @IsStrongPassword()
  password: string;
}
