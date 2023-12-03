import { Column, Entity } from 'typeorm';
import { IsEmail } from 'class-validator';
import { CompanyUser } from './user.base.entity';

@Entity('companyAdmins')
export class CompanyAdmin extends CompanyUser {
  @Column({ unique: true })
  @IsEmail()
  email: string;
}
