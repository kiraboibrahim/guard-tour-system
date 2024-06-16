import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsISO8601, IsMilitaryTime } from 'class-validator';
import { SecurityGuard } from '../../security-guard/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Exclude } from 'class-transformer';
import { LocalDateTime, ZoneId } from '@js-joda/core';

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

  @Exclude()
  @Column()
  siteId: number;

  @ManyToOne(() => Site, { onDelete: 'CASCADE', eager: true })
  site: Site;

  // TODO: Remove nullable: true after updating the database
  @Column({ nullable: true })
  securityGuardUniqueId: string;

  @Exclude()
  @Column({ nullable: true })
  securityGuardId: number;

  @ManyToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrols, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  securityGuard: SecurityGuard;

  isNextPatrolOverDue() {
    const timezone = process.env.TZ as string;
    let submittedAt;
    try {
      submittedAt = LocalDateTime.parse(
        `${this.date}T${this.startTime}`,
      ).atZone(ZoneId.of(timezone));
    } catch (err) {
      return true;
    }

    const nextSubmissionDateTime = submittedAt.plusHours(
      this.site.notificationCycle,
    );
    const now = LocalDateTime.now().atZone(ZoneId.of(timezone));
    return now.isAfter(nextSubmissionDateTime);
  }
}
