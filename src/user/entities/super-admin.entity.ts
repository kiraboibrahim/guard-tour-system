import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { User } from './user.base.entity';
import { Company } from '../../company/entities/company.entity';
import { Expose, Transform } from 'class-transformer';

@Entity('superAdmins')
export class SuperAdmin {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  @IsEmail()
  email: string;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  belongsToCompany(companyId: number) {
    return true;
  }
}
