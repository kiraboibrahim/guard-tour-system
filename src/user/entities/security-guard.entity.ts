import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsIn, IsISO8601 } from 'class-validator';
import { GENDER_OPTIONS } from '../constants';
import { Shift } from '../../patrol/entities/shift.entity';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { CompanyUser } from './user.base.entity';
import { SECURITY_GUARD_ROLE } from '../../roles/constants';

@Entity()
export class SecurityGuard extends CompanyUser {
  role = SECURITY_GUARD_ROLE;

  @Column()
  @IsIn(GENDER_OPTIONS)
  gender: string;

  @Column({ type: 'date' })
  @IsISO8601()
  dateOfBirth: string;

  @Column()
  armedStatus: boolean;

  @ManyToOne(() => Shift, (shift) => shift.securityGuards, { nullable: true })
  shift: Shift;

  @OneToMany(() => Patrol, (patrol) => patrol.securityGuard)
  patrols: Patrol;
}
