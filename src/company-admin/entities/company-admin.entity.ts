import { Entity } from 'typeorm';
import { BaseAuthCompanyUser } from '../../user/entities/user.base.entity';

@Entity()
export class CompanyAdmin extends BaseAuthCompanyUser {}
