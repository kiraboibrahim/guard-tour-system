import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { isInstance, IsISO8601, Matches } from 'class-validator';
import { Shift } from '../../shift/entities/shift.entity';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { IsValidGender } from '../user.validators';
import { CompanyUser } from './user.base.entity';
import {
  IndividualPatrolPlan,
  PatrolPlan,
} from '../../patrol-plan/entities/patrol-plan.entity';
import { TEN_DIGIT_NUMBER_REGEXP } from '../user.constants';
import { Site } from '../../site/entities/site.entity';

@Entity('securityGuards')
export class SecurityGuard extends CompanyUser {
  @Column()
  @IsValidGender()
  gender: string;

  @Column({ unique: true })
  @Matches(TEN_DIGIT_NUMBER_REGEXP)
  uniqueId: string; // Security Guard Username

  @Column({ type: 'date' })
  @IsISO8601()
  dateOfBirth: string;

  @Column()
  armedStatus: boolean;

  @Column({ nullable: true })
  shiftId: number;

  @ManyToOne(() => Shift, (shift) => shift.securityGuards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  shift: Shift;

  @OneToOne(
    () => IndividualPatrolPlan,
    (patrolPlan) => patrolPlan.securityGuard,
    { nullable: true, onDelete: 'SET NULL' },
  )
  patrolPlan: PatrolPlan;

  @OneToMany(() => Patrol, (patrol) => patrol.securityGuard)
  patrols: Patrol;

  get deployedSite(): Site {
    return this.shift?.site;
  }

  isDeployedToSite(site: Site | number) {
    return site instanceof Site
      ? this.deployedSite.id === site.id
      : (this.deployedSite.id = site);
  }
}
