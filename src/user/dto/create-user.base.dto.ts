import { IsAlpha, MaxLength } from 'class-validator';
import { MAX_NAME_LENGTH } from '../user.constants';
import { HasStrongPasswordQualities } from '../user.validators';
import { IsUGPhoneNumber, IsUnique } from '../../core/core.validators';
import { User } from '../entities/user.base.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
  @IsUnique(User)
  phoneNumber: string;

  @ApiProperty()
  @HasStrongPasswordQualities()
  password: string;
}
