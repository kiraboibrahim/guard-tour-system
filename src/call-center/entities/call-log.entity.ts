import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from '@site/entities/site.entity';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';
import { DateTimeFormatter, LocalDate, LocalTime, ZoneId } from '@js-joda/core';

@Entity()
export class CallLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: string;

  @Column()
  date: string;

  @ManyToOne(() => Site, { eager: true })
  site: Site;

  @Column({ default: false })
  isAnswered: boolean;

  @ManyToOne(() => SecurityGuard, undefined, { nullable: true, eager: true })
  answeredBy: SecurityGuard;

  @Column({ nullable: true, default: null })
  response: string;

  @BeforeInsert()
  setDate() {
    const today = LocalDate.now(ZoneId.of(process.env.TZ as string));
    this.date = today.toString();
  }

  @BeforeInsert()
  setTime() {
    const now = LocalTime.now(ZoneId.of(process.env.TZ as string));
    this.time = now.format(DateTimeFormatter.ofPattern('HH:mm'));
  }

  static async setIsAnswered(id: number, securityGuard: SecurityGuard) {
    /**
     * Instead of turning this into an instance method, I am using a static method
     * in order not update any other attributes other than the 'isAnswered' and
     * the 'answeredBy' attributes
     */
    return await CallLog.update(
      { id },
      { isAnswered: true, answeredBy: securityGuard },
    );
  }

  static async updateResponse(id: number, response: string) {
    return await CallLog.update({ id }, { response });
  }

  static async createLog(site: Site, answeredBy?: SecurityGuard) {
    const isAnswered = !!answeredBy;
    const callLog = CallLog.create({ site, answeredBy, isAnswered });
    return CallLog.save(callLog);
  }
}
