import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { SecurityGuard } from '../../user/entities/security-guard.entity';

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  patrolFrequency: number;

  @ManyToOne(() => Site)
  site: Site;

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.shift)
  securityGuards: SecurityGuard[];
}
