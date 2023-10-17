import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Device } from '../../device/entities/device.entity';
import { Shift } from '../../shift/entities/shift.entity';
import {
  INDIVIDUAL_PATROL_PLAN,
  GROUP_PATROL_PLAN,
} from '../patrol-plan.constants';
import { IsIn } from 'class-validator';

// A set of devices to be patrolled
@Entity('patrolPlans')
export class PatrolPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siteId: number;

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => Device, (device) => device.patrolPlan, { eager: true })
  devices: Device[];

  @Column()
  @IsIn([INDIVIDUAL_PATROL_PLAN, GROUP_PATROL_PLAN])
  patrolPlanType: number;
}

@Entity('individualPatrolPlans')
export class IndividualPatrolPlan {
  @PrimaryColumn()
  patrolPlanId: number;

  @OneToOne(() => PatrolPlan, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  patrolPlan: PatrolPlan;

  @OneToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrolPlan, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  securityGuard: SecurityGuard;
}

@Entity('groupPatrolPlans')
export class GroupPatrolPlan {
  @PrimaryColumn()
  patrolPlanId: number;

  @OneToOne(() => PatrolPlan, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  patrolPlan: PatrolPlan;

  @OneToOne(() => Shift, (shift) => shift.patrolPlan, { onDelete: 'CASCADE' })
  shift: Shift;
}
