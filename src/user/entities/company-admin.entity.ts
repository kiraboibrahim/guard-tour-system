import { Column, Entity } from 'typeorm';
import { IsEmail } from 'class-validator';
import { CompanyUser } from './user.base.entity';
import { COMPANY_ADMIN_ROLE } from '../../roles/constants';

@Entity()
export class CompanyAdmin extends CompanyUser {
  role = COMPANY_ADMIN_ROLE;

  @Column()
  @IsEmail()
  email: string;
}
