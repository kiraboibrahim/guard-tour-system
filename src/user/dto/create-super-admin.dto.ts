import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../core/core.validators';
import { AuthUser } from '../entities/user.base.entity';

export class CreateSuperAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsUnique<AuthUser>(AuthUser, 'username')
  @IsEmail()
  email: string;
}
