import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Site } from '@site/entities/site.entity';

@Injectable()
export class SiteUpdaterTask {
  constructor() {}

  @Cron(CronExpression.EVERY_HOUR, {
    timeZone: process.env.TZ,
    name: 'Site Updater',
  })
  async updateSiteLatestPatrol() {
    for await (const sites of Site.streamSites()) {
      for (const site of sites) {
        await site.updateLatestPatrol();
        await site.updateSecurityGuardCount();
      }
    }
  }
}
