import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { Site } from '../site/entities/site.entity';
import { CompanyAdmin } from '../company-admin/entities/company-admin.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Patrol } from '../patrol/entities/patrol.entity';
import { SMSService } from '../core/services/sms.service';
import { DelayedPatrolNotification } from '../site/entities/delayed-patrol-notification.entity';
import { removeDuplicates } from '../core/core.utils';

/**
 * The following task is supposed to run every 1.5 hours starting from midnight(00:00)
 * However, due to cron not supporting fractional units, we declared two cron jobs
 * with one starting at 00:00 and running every 3 hours(2 * 1.5 hours) and the other cron
 * starts at 01:30 and running every 3 hours. The second cron covers the time intervals
 * missed out by the first cron.
 */

const MIDNIGHT_SHARP_CRON = 'midnightSharpNotifications';
const THIRTY_MIN_PAST_ONE_CRON = '30MinPastOneNotifications';
@Injectable()
export class DelayedPatrolNotificationService {
  private readonly CACHE_DURATION = 24 * 3600 * 1000; // A DAY
  private readonly logger = new Logger(DelayedPatrolNotificationService.name);

  private siteRepository: Repository<Site>;
  private patrolRepository: Repository<Patrol>;
  private companyAdminRepository: Repository<CompanyAdmin>;
  private patrolDelayedNotificationRepository: Repository<DelayedPatrolNotification>;

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private smsService: SMSService,
  ) {
    this.siteRepository = this.entityManager.getRepository(Site);
    this.patrolRepository = this.entityManager.getRepository(Patrol);
    this.companyAdminRepository =
      this.entityManager.getRepository(CompanyAdmin);
    this.patrolDelayedNotificationRepository = this.entityManager.getRepository(
      DelayedPatrolNotification,
    );
  }

  @Cron('0 0,3,6,9,12,15,18,21 * * *', {
    timeZone: process.env.TZ,
    name: MIDNIGHT_SHARP_CRON,
  })
  async fromMidnightSharp() {
    await this.triggerNotifications();
  }

  @Cron('30 1,4,7,10,13,16,19,22 * * *', {
    timeZone: process.env.TZ,
    name: THIRTY_MIN_PAST_ONE_CRON,
  })
  async from30MinPastOne() {
    await this.triggerNotifications();
  }

  async triggerNotifications() {
    for await (const site of this.getOverDueSites()) {
      const companyAdmins = await this.companyAdminRepository.find({
        where: { companyId: site.companyId },
        cache: this.CACHE_DURATION,
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

  async *getOverDueSites() {
    const notificationEnabledSites = await this.getNotificationEnabledSites();
    for (const site of notificationEnabledSites) {
      const latestSitePatrol = await this.getLatestSitePatrol(site);
      const latestSiteNotification = await this.getLatestSiteNotification(site);
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
  async getNotificationEnabledSites() {
    // Cache the sites whose notifications are turned on because these don't change frequently
    return await this.siteRepository.find({
      where: [{ notificationsEnabled: true }],
      cache: this.CACHE_DURATION,
    });
  }
  async getLatestSitePatrol(site: Site) {
    return await this.patrolRepository.findOne({
      where: { siteId: site.id },
      order: {
        date: 'DESC',
        startTime: 'DESC',
      },
    });
  }

  async getLatestSiteNotification(site: Site) {
    return await this.patrolDelayedNotificationRepository.findOne({
      where: { siteId: site.id },
      order: {
        dateCreatedAt: 'DESC',
        timeCreatedAt: 'DESC',
      },
    });
  }

  async saveNotification(site: Site) {
    const notification = this.patrolDelayedNotificationRepository.create({
      site,
      siteId: site.id,
    });
    await this.patrolDelayedNotificationRepository.save(notification);
  }

  async notify(companyAdmins: CompanyAdmin[], site: Site) {
    const companyAdminsPhoneNumbers = removeDuplicates(
      companyAdmins.map((companyAdmin) => companyAdmin.user.phoneNumber),
    );
    const message = `The site, ${site.name} has been idle for at-least ${site.notificationCycle} hours without being patrolled`;
    await this.smsService.send(companyAdminsPhoneNumbers, message);
  }
}
