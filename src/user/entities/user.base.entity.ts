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
import { IsStrongPassword } from '../user.validators';
import { IsValidRole } from '../../roles/roles.validators';
import { IsUGPhoneNumber } from '../../core/core.validators';

export class UserSerializer {
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
}

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
  @IsStrongPassword()
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

export class CompanyUser extends UserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  companyId: number;

  @Exclude()
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }
}
