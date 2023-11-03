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
import { Exclude, Expose, Transform } from 'class-transformer';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Device } from '../../device/entities/device.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { IsValidPatrolPlanType } from '../patrol-plan.validators';

// A set of devices to be patrolled
@Entity('patrolPlans')
export class PatrolPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => Device, (device) => device.patrolPlan, { eager: true })
  devices: Device[];

  @Column()
  @IsValidPatrolPlanType()
  patrolPlanType: string;
}

@Entity('individualPatrolPlans')
export class IndividualPatrolPlan {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  patrolPlanId: number;

  @Exclude()
  @OneToOne(() => PatrolPlan, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patrolPlan: PatrolPlan;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  siteId: number;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  devices: Device[];

  @Column()
  securityGuardId: number;

  @Exclude()
  @OneToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrolPlan, {
    onDelete: 'CASCADE',
  })
  securityGuard: SecurityGuard;
}

@Entity('groupPatrolPlans')
export class GroupPatrolPlan {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  patrolPlanId: number;

  @Exclude()
  @OneToOne(() => PatrolPlan, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patrolPlan: PatrolPlan;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  siteId: number;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  devices: Device[];

  @Column()
  shiftId: number;

  @Exclude()
  @OneToOne(() => Shift, (shift) => shift.patrolPlan, { onDelete: 'CASCADE' })
  shift: Shift;
}
