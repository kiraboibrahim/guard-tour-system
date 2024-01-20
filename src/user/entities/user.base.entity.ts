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
import { Role } from '../../roles/roles';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @IsUGPhoneNumber()
  phoneNumber: string;

  @Column()
  @IsValidRole()
  role: string;
}

export class UserSerializer {
  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  firstName: string;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  lastName: string;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  role: Role;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  phoneNumber: string;
}

/* An AuthUser is one who will be authenticated by the system */
@Entity('authUsers')
export class AuthUser extends User {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  @IsStrongPassword()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}

export class AuthUserSerializer extends UserSerializer {
  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  username: string;
}

class BaseCompanyUser extends UserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Column()
  companyId: number;

  @Exclude()
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }
}

/* An AuthCompanyUser is one who will be authenticated by the system and he/she will also be affiliated to a company */
export class AuthCompanyUser extends BaseCompanyUser {
  @Exclude()
  @OneToOne(() => AuthUser, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: AuthUser;

  @Expose()
  @Transform(({ obj, key }) => obj.user[key])
  username: string;
}

export class CompanyUser extends BaseCompanyUser {
  @Exclude()
  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
