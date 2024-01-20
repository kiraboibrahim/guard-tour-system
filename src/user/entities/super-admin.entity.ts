import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { AuthUser, AuthUserSerializer } from './user.base.entity';
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

  @Column({ unique: true })
  @IsEmail()
  email: string;
}
