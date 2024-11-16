import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Patrol } from '@patrol/entities/patrol.entity';
import { SECURITY_GUARD_TYPE } from '../security-guard.constants';
import { Shift } from '@shift/entities/shift.entity';
import { NonAuthCompanyUser } from '@user/entities/company-user.base.entity';

@Entity()
export class SecurityGuard extends NonAuthCompanyUser {
  @Column()
  gender: string;

  @Column({ unique: true })
  uniqueId: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @OneToMany(() => Patrol, (patrol) => patrol.securityGuard)
  patrols: Patrol;

  @Column({ default: SECURITY_GUARD_TYPE.FIELD })
  type: string;

  @ManyToOne(() => Shift, (shift) => shift.securityGuards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  shift: Shift | null;
}
