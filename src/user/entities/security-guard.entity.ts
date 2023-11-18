import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsISO8601 } from 'class-validator';
import { Shift } from '../../shift/entities/shift.entity';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { CompanyUser } from './user.base.entity';
import {
  IndividualPatrolPlan,
  PatrolPlan,
} from '../../patrol-plan/entities/patrol-plan.entity';
import { Site } from '../../site/entities/site.entity';
import { Exclude } from 'class-transformer';

@Entity('securityGuards')
export class SecurityGuard extends CompanyUser {
  @Column()
  gender: string;

  @Column({ unique: true })
  uniqueId: string;

  @Column({ type: 'date' })
  @IsISO8601()
  dateOfBirth: string;

  @Column()
  armedStatus: boolean;

  @Column({ nullable: true })
  deployedSiteId: number | null;

  @Exclude()
  @ManyToOne(() => Site, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  deployedSite: Site;

  @Column({ nullable: true })
  shiftId: number;

  @ManyToOne(() => Shift, (shift) => shift.securityGuards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  shift: Shift;

  @Exclude()
  @OneToOne(
    () => IndividualPatrolPlan,
    (patrolPlan) => patrolPlan.securityGuard,
  )
  patrolPlan: PatrolPlan;

  @OneToMany(() => Patrol, (patrol) => patrol.securityGuard)
  patrols: Patrol;

  isDeployedToSite(siteOrId: Site | number) {
    return siteOrId instanceof Site
      ? this.deployedSiteId === siteOrId.id
      : this.deployedSiteId === siteOrId;
  }
  isInShift(shiftId: number) {
    return this.shiftId === shiftId;
  }

  isNotDeployedToAnySite() {
    return this.deployedSiteId === null;
  }
}
