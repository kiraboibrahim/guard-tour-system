import { CreateUserDto } from './create-user.base.dto';
import { IsEmail } from 'class-validator';
import { IsUnique, LoadEntityIfExists } from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from '../entities/user.base.entity';

export class CreateCompanyAdminDto extends CreateUserDto {
  @ApiProperty()
  @LoadEntityIfExists<Company>(Company, 'company')
  companyId: number;

  @ApiProperty()
  @IsUnique<AuthUser>(AuthUser, 'username')
  @IsEmail()
  email: string;
}
