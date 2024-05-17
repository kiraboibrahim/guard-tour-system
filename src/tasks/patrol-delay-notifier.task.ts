import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { Site } from '../site/entities/site.entity';
import { CompanyAdmin } from '../user/entities/company-admin.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Patrol } from '../patrol/entities/patrol.entity';
import { SMSService } from '../core/services/sms.service';
import { PatrolDelayNotification } from '../site/entities/patrol-delay-notification.entity';
import { getHoursDiff } from '../core/core.utils';
/**
 * The following task is supposed to run every 1.5 hours starting from midnight(00:00)
 * However, due to cron not supporting fractional units, we declared two cron jobs
 * with one starting at 00:00 and running every 3 hours(2 * 1.5 hours) and the other cron
 * starts at 01:30 and running every 3 hours. The second cron covers the time intervals
 * missed out by the first cron.
 */

const MIDNIGHT_SHARP_CRON = 'midnightSharpNotifications';
const THIRTY_MIN_PAST_ONE_CRON = '30MinPastOne';

@Injectable()
export class PatrolDelayedNotificationService {
  private readonly SINGLE_DAY = 24 * 3600 * 1000; // A DAY
  private readonly logger = new Logger(PatrolDelayedNotificationService.name);

  private siteRepository: Repository<Site>;
  private patrolRepository: Repository<Patrol>;
  private companyAdminRepository: Repository<CompanyAdmin>;
  private patrolDelayedNotificationRepository: Repository<PatrolDelayNotification>;

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private smsService: SMSService,
  ) {
    this.siteRepository = this.entityManager.getRepository(Site);
    this.patrolRepository = this.entityManager.getRepository(Patrol);
    this.companyAdminRepository =
      this.entityManager.getRepository(CompanyAdmin);
    this.patrolDelayedNotificationRepository = this.entityManager.getRepository(
      PatrolDelayNotification,
    );
  }

  @Cron('0 0,3,6,9,12,15,18,21 * * *', {
    timeZone: 'Africa/Kampala',
    name: MIDNIGHT_SHARP_CRON,
  })
  async fromMidnightSharp() {
    await this.triggerNotifications();
  }

  @Cron('30 1,4,7,10,13,16,19,22 * * *', {
    timeZone: 'Africa/Kampala',
    name: THIRTY_MIN_PAST_ONE_CRON,
  })
  async from30MinPastOne() {
    await this.triggerNotifications();
  }

  async triggerNotifications() {
    for await (const site of this.generateDelayedSites()) {
      const companyAdmins = await this.companyAdminRepository.find({
        where: { companyId: site.companyId },
        cache: this.SINGLE_DAY,
      });
      await this.saveNotification(site);
      const siteHasCompanyAdmins = companyAdmins.length !== 0;
      if (!siteHasCompanyAdmins) {
        this.logger.warn(
          `The company of ${site.name} has no company admins. Skipping sending sms to company admins`,
        );
        continue;
      }

      await this.notify(companyAdmins, site);
    }
  }
  async *generateDelayedSites() {
    // Cache the sites whose notifications are turned on because these don't change frequently
    const notificationEnabledSites = await this.siteRepository.find({
      where: [{ notificationsEnabled: true }],
      cache: this.SINGLE_DAY,
    });
    for (const site of notificationEnabledSites) {
      const latestSitePatrol = await this.patrolRepository.findOne({
        where: { siteId: site.id },
        order: {
          date: 'DESC',
          startTime: 'DESC',
        },
      });
      const patrolStartDateTime = `${latestSitePatrol?.date} ${latestSitePatrol?.startTime}`;
      if (latestSitePatrol !== null) {
        const hourDiff = getHoursDiff(patrolStartDateTime);
        if (hourDiff > site.notificationCycle) {
          yield site;
        }
      }
    }
  }
  async saveNotification(site: Site) {
    const now = new Date();
    const timeCreatedAt = `${now.getHours()}:${now.getMinutes()}`;
    const notification = this.patrolDelayedNotificationRepository.create({
      site,
      siteId: site.id,
      timeCreatedAt,
    });
    await this.patrolDelayedNotificationRepository.save(notification);
  }

  async notify(companyAdmins: CompanyAdmin[], site: Site) {
    const companyAdminsPhoneNumbers = companyAdmins.map(
      (companyAdmin) => companyAdmin.user.phoneNumber,
    );
    const message = `The site, ${site.name} has been idle for at-least ${site.notificationCycle} hours without being patrolled`;
    await this.smsService.send(companyAdminsPhoneNumbers, message);
  }
}
