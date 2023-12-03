import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
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
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.shift, {
    eager: true,
  })
  securityGuards: SecurityGuard[];
}
