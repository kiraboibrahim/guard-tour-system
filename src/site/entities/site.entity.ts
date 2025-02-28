import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '@company/entities/company.entity';
import { SiteAdmin } from '@site-admin/entities/site-admin.entity';
import { Tag } from '@tag/entities/tag.entity';
import { Exclude } from 'class-transformer';
import { PATROL_TYPE } from '../site.constants';
import { SiteOwner } from '../../site-owner/entities/site-owner.entity';
import { Patrol } from '@patrol/entities/patrol.entity';
import { DelayedPatrolNotification } from '@site/entities/delayed-patrol-notification.entity';
import { Shift } from '@shift/entities/shift.entity';
import { LocalTime, ZoneId } from '@js-joda/core';
import {
  NIGHT_SHIFT_END_TIME,
  DAY_SHIFT_END_TIME,
  SHIFT_TYPE,
  NIGHT_SHIFT_START_TIME,
} from '@shift/shift.constants';
import { stripEndSlash } from '@nestjs/common/utils/shared.utils';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';

@Entity()
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  tagId: string;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column()
  phoneNumber: string;

  @Exclude()
  @Column()
  companyId: number;

  /* TODO: Remove 'nullable: true' once this field has been updated for all the sites */
  @Column({ nullable: true })
  requiredPatrolsPerGuard: number;

  @Column({ type: 'boolean', default: false })
  notificationsEnabled: boolean;

  /* TODO: Remove 'nullable: true' once this field has been updated for all the sites */
  @Column({ nullable: true, type: 'decimal' })
  notificationCycle: number;

  @ManyToOne(() => Company, { eager: true, onDelete: 'CASCADE' })
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site, {
    nullable: true,
    eager: true,
  })
  admin: SiteAdmin;

  @Column({ nullable: true })
  ownerUserId: number;

  @ManyToOne(() => SiteOwner, { nullable: true, onDelete: 'SET NULL' })
  owner: SiteOwner | null;

  @OneToMany(() => Tag, (tag) => tag.site)
  tags: Tag[];

  @Column({ default: PATROL_TYPE.INDIVIDUAL })
  patrolType: string;

  @Column({ nullable: true })
  securityGuardCount: number;

  @OneToOne(() => Patrol, { nullable: true })
  @JoinColumn()
  latestPatrol: Patrol;

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }

  hasIndividualPatrolType() {
    return this.patrolType === PATROL_TYPE.INDIVIDUAL;
  }

  static async findActiveSecurityGuards(site: Site) {
    const isDayTime = () => {
      const now = LocalTime.now(ZoneId.of(process.env.TZ as string));
      const nightShiftEndTime = LocalTime.of(
        ...NIGHT_SHIFT_END_TIME.split(':').map((v) => parseInt(v)),
      );
      const nightShiftStartTime = LocalTime.of(
        ...NIGHT_SHIFT_START_TIME.split(':').map((v) => parseInt(v)),
      );
      return (
        now.isAfter(nightShiftEndTime) && now.isBefore(nightShiftStartTime)
      );
    };
    const activeShift = isDayTime() ? SHIFT_TYPE.DAY : SHIFT_TYPE.NIGHT;
    const shifts = await Shift.find({
      where: {
        site: { id: site.id },
        type: activeShift,
      },
    });

    const securityGuards = [];
    for (const shift of shifts) {
      securityGuards.push(...shift.securityGuards);
    }
    return securityGuards;
  }

  static async *findOverDueSites() {
    const notificationEnabledSites = await Site.findNotificationEnabledSites();
    for (const site of notificationEnabledSites) {
      const latestSitePatrol = await site.findLatestPatrol();
      const latestSiteNotification = await site.findLatestNotification();
      const isSitePatrolOverDue =
        !!latestSitePatrol && latestSitePatrol.isNextPatrolOverDue();
      /* Site Notifications are overdue when latest site notification isn't with in the expected next creation time
       * or when the site has never generated any notifications-- The site has no notifications.
       * */
      const isSiteNotificationOverDue =
        (!!latestSiteNotification &&
          latestSiteNotification.isNextNotificationOverDue()) ||
        latestSiteNotification === null;

      if (isSitePatrolOverDue && isSiteNotificationOverDue) {
        yield site;
      }
    }
  }

  async findLatestPatrol() {
    return await Patrol.findOne({
      where: { siteId: this.id },
      order: {
        date: 'DESC',
        startTime: 'DESC',
      },
    });
  }

  async findLatestNotification() {
    return await DelayedPatrolNotification.findOne({
      where: { siteId: this.id },
      order: {
        dateCreatedAt: 'DESC',
        timeCreatedAt: 'DESC',
      },
    });
  }

  async updateLatestPatrol() {
    const latestPatrol = await this.findLatestPatrol();
    if (!latestPatrol) return;
    if (this.latestPatrol?.id !== latestPatrol?.id) {
      this.latestPatrol = latestPatrol;
      return await Site.save(this);
    }
  }

  async updateSecurityGuardCount() {
    this.securityGuardCount = await SecurityGuard.countBy({
      shift: { site: { id: this.id } },
    });
    return await Site.save(this);
  }

  static async *streamSites(limit = 10) {
    let page = 1;
    let offset = (page - 1) * limit;
    while (true) {
      const sites = await Site.find({
        order: {
          id: 'DESC',
        },
        skip: offset,
        take: limit,
      });
      if (!sites.length || sites.length < limit) break;
      offset = (++page - 1) * limit;
      yield sites;
    }
  }

  static async findNotificationEnabledSites() {
    const CACHE_DURATION = 24 * 3600 * 1000; // A DAY
    return await this.find({
      where: [{ notificationsEnabled: true }],
      cache: CACHE_DURATION,
    });
  }
}
