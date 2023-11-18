import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsISO8601, IsMilitaryTime } from 'class-validator';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { Exclude } from 'class-transformer';

@Entity('patrols')
export class Patrol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsISO8601()
  date: string;

  @Column({ type: 'time' })
  @IsMilitaryTime()
  startTime: string;

  @Column({ type: 'time' })
  @IsMilitaryTime()
  endTime: string;

  @Column()
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  @Column({ nullable: true })
  shiftId: number;

  @Exclude()
  @ManyToOne(() => Shift, { onDelete: 'SET NULL', nullable: true })
  shift: Shift;

  @Column()
  securityGuardId: number;

  @Exclude()
  @ManyToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrols, {
    onDelete: 'CASCADE',
  })
  securityGuard: SecurityGuard;
}
