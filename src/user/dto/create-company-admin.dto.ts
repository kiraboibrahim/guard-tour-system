import { CreateUserDto } from './create-user.base.dto';
import { IsEmail, Validate } from 'class-validator';
import { IsExistsAndLoadEntity, IsUnique } from '../../core/core.validators';
import { Company } from '../../company/entities/company.entity';
import { CompanyAdmin } from '../entities/company-admin.entity';

export class CreateCompanyAdminDto extends CreateUserDto {
  @Validate(IsExistsAndLoadEntity, [Company, 'company'])
  companyId: number;

  @IsEmail()
  @Validate(IsUnique, [CompanyAdmin])
  email: string;
}
