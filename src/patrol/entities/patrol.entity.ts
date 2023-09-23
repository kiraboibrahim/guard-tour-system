import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsISO8601 } from 'class-validator';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Shift } from './shift.entity';

@Entity()
export class Patrol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsISO8601()
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Site)
  site: Site;

  @ManyToOne(() => Shift)
  shift: Shift;

  @ManyToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrols)
  securityGuard: SecurityGuard;
}
