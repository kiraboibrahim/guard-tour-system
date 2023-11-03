import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';
import { IsUnique } from '../../core/core.validators';
import { SuperAdmin } from '../entities/super-admin.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsUnique(SuperAdmin)
  email: string;
}
