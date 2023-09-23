import {
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { IsPhoneNumber, IsStrongPassword } from 'class-validator';
import * as argon2 from 'argon2';
import { Company } from '../../company/entities/company.entity';
import {
  MIN_LOWERCASE_IN_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_SYMBOLS_IN_PASSWORD,
  MIN_UPPERCASE_IN_PASSWORD,
} from '../constants';
import { UNDEFINED_ROLE } from '../../roles/constants';

export class User {
  role = UNDEFINED_ROLE;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @IsPhoneNumber('UG')
  phoneNumber: string;

  @Column()
  @IsStrongPassword({
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE_IN_PASSWORD,
    minUppercase: MIN_UPPERCASE_IN_PASSWORD,
    minSymbols: MIN_SYMBOLS_IN_PASSWORD,
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}

export class CompanyUser extends User {
  @ManyToOne(() => Company)
  company: Company;
}
