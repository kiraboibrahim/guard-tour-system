import { Module } from '@nestjs/common';
import { DelayedPatrolNotificationService } from './delayed-patrol-notifier.task';

@Module({
  providers: [DelayedPatrolNotificationService],
})
export class TasksModule {}
