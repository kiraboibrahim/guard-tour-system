import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.base.dto';

export class CreateSiteAdminDto extends CreateUserDto {
  site: number;

  @IsEmail()
  email: string;
}
