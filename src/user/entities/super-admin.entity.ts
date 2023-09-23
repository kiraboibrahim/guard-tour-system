import { Column, Entity } from 'typeorm';
import { IsEmail } from 'class-validator';
import { User } from './user.base.entity';
import { SUPER_ADMIN_ROLE } from '../../roles/constants';

@Entity()
export class SuperAdmin extends User {
  role = SUPER_ADMIN_ROLE;

  @Column()
  @IsEmail()
  email: string;
}
