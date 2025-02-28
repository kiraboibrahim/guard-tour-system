import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Site } from '@site/entities/site.entity';
import { InjectQueue } from '@nestjs/bullmq';
import {
  DELAYED_PATROL_CALL_QUEUE,
  DELAYED_PATROL_CALL_QUEUE_TASK,
} from '../queue/queue.constants';
import { Queue } from 'bullmq';

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
export class PatrolReminderTask {
  constructor(
    @InjectQueue(DELAYED_PATROL_CALL_QUEUE)
    private delayedPatrolCallQueue: Queue,
  ) {}

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
    for await (const site of Site.findOverDueSites()) {
      await this.delayedPatrolCallQueue.add(DELAYED_PATROL_CALL_QUEUE_TASK, {
        site,
      });
    }
  }
}
