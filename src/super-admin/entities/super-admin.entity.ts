import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import {
  AuthUser,
  AuthUserSerializer,
} from '../../user/entities/user.base.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('superAdmins')
export class SuperAdmin extends AuthUserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => AuthUser, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: AuthUser;
}
