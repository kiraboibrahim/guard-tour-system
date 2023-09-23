import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';

export class CreateSuperAdminDto extends CreateUserDto {
  @IsEmail()
  email: string;
}
