import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../core/core.validators';
import { User } from '../entities/user.base.entity';

export class CreateSuperAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsUnique<User>(User, 'username')
  @IsEmail()
  email: string;
}
