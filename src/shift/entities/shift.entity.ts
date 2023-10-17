import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { GroupPatrolPlan } from '../../patrol-plan/entities/patrol-plan.entity';

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

  @ManyToOne(() => Site, { eager: true, onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.shift, {
    eager: true,
  })
  securityGuards: SecurityGuard[];

  @OneToOne(() => GroupPatrolPlan, (groupPatrolPlan) => groupPatrolPlan.shift, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  patrolPlan: GroupPatrolPlan;
}
