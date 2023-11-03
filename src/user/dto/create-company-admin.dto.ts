import { CreateUserDto } from './create-user.base.dto';
import { IsEmail } from 'class-validator';
import { IsExistsAndLoadEntity, IsUnique } from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { CompanyAdmin } from '../entities/company-admin.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsExistsAndLoadEntity(Company, 'company')
  companyId: number;

  @ApiProperty()
  @IsEmail()
  @IsUnique(CompanyAdmin)
  email: string;
}
