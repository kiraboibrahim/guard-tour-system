import { Module } from '@nestjs/common';
import { PatrolDelayedNotificationService } from './patrol-delay-notifier.task';

@Module({
  providers: [PatrolDelayedNotificationService],
})
export class TasksModule {}
