import { CreateUserDto } from './create-user.base.dto';
import { IsEmail } from 'class-validator';

export class CreateCompanyAdminDto extends CreateUserDto {
  @IsEmail()
  email: string;
}
