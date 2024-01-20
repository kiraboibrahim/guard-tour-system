import { Column, Entity } from 'typeorm';
import { IsEmail } from 'class-validator';
import { AuthCompanyUser } from './user.base.entity';

@Entity('companyAdmins')
export class CompanyAdmin extends AuthCompanyUser {
  @Column({ unique: true })
  @IsEmail()
  email: string;
}
