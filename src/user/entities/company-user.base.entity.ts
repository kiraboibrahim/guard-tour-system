import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Company } from '@company/entities/company.entity';
import { User, UserSerializer } from '@user/entities/user.base.entity';
import {
  AuthUser,
  AuthUserSerializer,
} from '@user/entities/auth-user.base.entity';

// A user who is affiliated to a company
export class NonAuthCompanyUser extends UserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Exclude()
  @Column()
  companyId: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE', eager: true })
  company: Company;

  getFirstName() {
    return this.user.firstName;
  }

  getLastName() {
    return this.user.lastName;
  }

  getPhoneNumber() {
    return this.user.phoneNumber;
  }
}

export class AuthCompanyUser extends AuthUserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => AuthUser, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: AuthUser;

  @Column()
  companyId: number;

  @Exclude()
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  getFirstName() {
    return this.user.firstName;
  }

  getLastName() {
    return this.user.lastName;
  }

  getPhoneNumber() {
    return this.user.phoneNumber;
  }
}
