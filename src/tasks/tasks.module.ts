import { Module } from '@nestjs/common';
import { PatrolReminderTask } from './patrol-reminder.task';
import { SiteUpdaterTask } from '@tasks/site-updater.task';

@Module({
  providers: [PatrolReminderTask, SiteUpdaterTask],
})
export class TasksModule {}
