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
import { Exclude, Expose, Transform } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';
import { IsValidRole } from '../../roles/roles.validators';
import { Role } from '../../roles/roles';
import { hash } from '../../core/core.utils';

// A basic user that contains fields shared by all users
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  @IsValidRole()
  role: string;
}

/* An AuthUser is one who will be authenticated by the system using a username and password */
@Entity()
export class AuthUser extends User {
  static USERNAME_FIELD = 'email' as const;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  get username() {
    return this[`${AuthUser.USERNAME_FIELD}`];
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!!this.password) {
      this.password = await hash(this.password);
    }
  }
}

export class UserSerializer {
  @Expose()
  @Transform(({ obj, key }) => obj?.user[key])
  firstName: string;

  @Expose()
  @Transform(({ obj, key }) => obj?.user[key])
  lastName: string;

  @Expose()
  @Transform(({ obj, key }) => obj?.user[key])
  role: Role;

  @Expose()
  @Transform(({ obj, key }) => obj?.user[key])
  phoneNumber: string;
}

export class AuthUserSerializer extends UserSerializer {
  @Expose()
  @Transform(({ obj, key }) => obj?.user[key])
  email: string;
}

export class BaseAuthUser extends AuthUserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => AuthUser, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: AuthUser;
}

// A user who is affiliated to a company
export class BaseCompanyUser extends UserSerializer {
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
}

/* An BaseAuthCompanyUser is one who will be authenticated by the system and he/she
is affiliated to a company */
export class BaseAuthCompanyUser extends AuthUserSerializer {
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
}
