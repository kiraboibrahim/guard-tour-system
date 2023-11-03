import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';
import { HasStrongPasswordQualities } from '../user.validators';
import { IsValidRole } from '../../roles/roles.validators';
import { IsUGPhoneNumber } from '../../core/core.validators';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @IsUGPhoneNumber()
  phoneNumber: string;

  @Column()
  @Exclude()
  @HasStrongPasswordQualities()
  password: string;

  @Column()
  @IsValidRole()
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}

export class CompanyUser {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Column()
  companyId: number;

  @Exclude()
  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  username: string;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  firstName: string;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  lastName: string;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  role: string;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  phoneNumber: string;

  @Exclude()
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  belongsToCompany(companyOrId: Company | number) {
    return companyOrId instanceof Company
      ? this.companyId === companyOrId.id
      : this.companyId === companyOrId;
  }
}
