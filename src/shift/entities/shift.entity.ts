import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { GroupPatrolPlan } from '../../patrol-plan/entities/patrol-plan.entity';
import { Exclude } from 'class-transformer';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  patrolFrequency: number; // Duration in minutes

  @Column()
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { eager: true, onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.shift, {
    eager: true,
    cascade: true,
  })
  securityGuards: SecurityGuard[];

  @Column({ nullable: true })
  patrolPlanId: number;

  @Exclude()
  @OneToOne(() => GroupPatrolPlan, (groupPatrolPlan) => groupPatrolPlan.shift, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  patrolPlan: GroupPatrolPlan;

  belongsToSite(siteOrId: Site | number) {
    return siteOrId instanceof Site
      ? this.siteId === siteOrId.id
      : this.siteId === siteOrId;
  }
  hasPatrolPlan() {
    return this.patrolPlanId !== null;
  }
}
