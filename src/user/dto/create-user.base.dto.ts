import { IsAlpha, MaxLength } from 'class-validator';
import { MAX_NAME_LENGTH } from '../user.constants';
import { IsStrongPassword } from '../user.validators';
import { IsUGPhoneNumber } from '../../core/core.validators';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsStrongPassword()
  password: string;
}
