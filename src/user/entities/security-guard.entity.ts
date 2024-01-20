import { Column, Entity, OneToMany } from 'typeorm';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { CompanyUser } from './user.base.entity';

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
}
