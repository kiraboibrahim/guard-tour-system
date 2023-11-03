import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { User } from './user.base.entity';
import { Company } from '../../company/entities/company.entity';

@Entity('superAdmins')
export class SuperAdmin {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  @IsEmail()
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  belongsToCompany(companyOrId: Company | number) {
    return true;
  }
}
