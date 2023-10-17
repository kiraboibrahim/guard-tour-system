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
import { IsPhoneNumber } from 'class-validator';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';
import { HasStrongPasswordQualities } from '../user.validators';
import { IsValidRole } from '../../roles/roles.validators';

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
  @IsPhoneNumber('UG')
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
  @PrimaryColumn()
  @Exclude()
  userId: number;

  @Column()
  companyId: number;

  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Company, { eager: true, onDelete: 'CASCADE' })
  company: Company;
}
