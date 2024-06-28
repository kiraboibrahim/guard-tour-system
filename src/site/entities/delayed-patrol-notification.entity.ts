import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Site } from './site.entity';
import { Exclude } from 'class-transformer';
import {
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
  LocalTime,
  ZoneId,
} from '@js-joda/core';
import { IsISO8601, IsMilitaryTime } from 'class-validator';

@Entity()
export class DelayedPatrolNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsISO8601()
  dateCreatedAt: string;

  @Column({ type: 'time' })
  @IsMilitaryTime()
  timeCreatedAt: string;

  @BeforeInsert()
  setDate() {
    const today = LocalDate.now(ZoneId.of(process.env.TZ as string));
    this.dateCreatedAt = today.toString();
  }

  @BeforeInsert()
  setTime() {
    const now = LocalTime.now(ZoneId.of(process.env.TZ as string));
    this.timeCreatedAt = now.format(DateTimeFormatter.ofPattern('HH:mm'));
  }

  @Exclude()
  @Column()
  siteId: number;

  @ManyToOne(() => Site, { eager: true, onDelete: 'CASCADE' })
  site: Site;

  isNextNotificationOverDue() {
    const timezone = process.env.TZ as string;
    let createdAt;
    try {
      createdAt = LocalDateTime.parse(
        `${this.dateCreatedAt}T${this.timeCreatedAt}`,
      ).atZone(ZoneId.of(timezone));
    } catch (err) {
      return true;
    }
    const nextNotificationDateTime = createdAt.plusHours(
      this.site.notificationCycle,
    );
    const now = LocalDateTime.now().atZone(ZoneId.of(timezone));
    return now.isAfter(nextNotificationDateTime);
  }
}
