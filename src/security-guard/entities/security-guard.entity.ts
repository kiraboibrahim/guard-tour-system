import { Column, Entity, OneToMany } from 'typeorm';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { CompanyUser } from '../../user/entities/user.base.entity';
import { SECURITY_GUARD_TYPE } from '../security-guard.constants';

@Entity('securityGuards')
export class SecurityGuard extends CompanyUser {
  @Column()
  gender: string;

  @Column({ unique: true })
  uniqueId: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column()
  armedStatus: boolean;

  @OneToMany(() => Patrol, (patrol) => patrol.securityGuard)
  patrols: Patrol;

  @Column({ default: SECURITY_GUARD_TYPE.FIELD })
  type: string;

  isSupervisor() {
    return this.type === SECURITY_GUARD_TYPE.SUPERVISOR;
  }
}
