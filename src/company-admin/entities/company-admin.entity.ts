import { Entity } from 'typeorm';
import { BaseAuthCompanyUser } from '../../user/entities/user.base.entity';

@Entity('companyAdmins')
export class CompanyAdmin extends BaseAuthCompanyUser {}
