import { Entity } from 'typeorm';
import { AuthCompanyUser } from '../../user/entities/user.base.entity';

@Entity('companyAdmins')
export class CompanyAdmin extends AuthCompanyUser {}
