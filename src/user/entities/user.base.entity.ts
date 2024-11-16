import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { IsValidRole } from '@roles/roles.validators';
import { Role } from '@roles/roles.constants';

// A user entity that captures the common attributes across all users
@Entity('users')
export class User extends BaseEntity {
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

/* Due to no support for multiple inheritance in typescript, this class is inheriting
 * from the BaseEntity so that user entities that inherit from this class
 * and inherit the BaseEntity properties
 */
export class UserSerializer extends BaseEntity {
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
