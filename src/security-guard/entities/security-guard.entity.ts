import { Column, Entity, OneToMany } from 'typeorm';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { BaseCompanyUser } from '../../user/entities/user.base.entity';
import { SECURITY_GUARD_TYPE } from '../security-guard.constants';

@Entity()
export class SecurityGuard extends BaseCompanyUser {
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
}
