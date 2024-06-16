import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyAdminDto } from './create-company-admin.dto';

export class UpdateCompanyAdminDto extends PartialType(CreateCompanyAdminDto) {}
