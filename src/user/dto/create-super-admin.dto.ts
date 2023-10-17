import { IsEmail, Validate } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';
import { IsUnique } from '../../core/core.validators';
import { SuperAdmin } from '../entities/super-admin.entity';

export class CreateSuperAdminDto extends CreateUserDto {
  @IsEmail()
  @Validate(IsUnique, [SuperAdmin])
  email: string;
}
