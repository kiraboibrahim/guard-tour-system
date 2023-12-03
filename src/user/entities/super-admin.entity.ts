import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { User, UserSerializer } from './user.base.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('superAdmins')
export class SuperAdmin extends UserSerializer {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  @IsEmail()
  email: string;
}
