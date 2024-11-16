import { Exclude, Expose, Transform } from 'class-transformer';
import { User, UserSerializer } from '@user/entities/user.base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { hash } from '@core/core.utils';

export class AuthUserSerializer extends UserSerializer {
  @Expose()
  @Transform(({ obj, key }) => obj?.user[key])
  email: string;
}

// A user that will authenticate with a username and password
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

export class BaseAuthUser extends AuthUserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => AuthUser, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: AuthUser;

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
