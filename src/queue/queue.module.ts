import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DELAYED_PATROL_CALL_QUEUE,
  DELAYED_PATROL_SMS_QUEUE,
} from './queue.constants';
import {
  DelayedPatrolCallConsumer,
  DelayedPatrolSMSConsumer,
} from './queue.consumers';
import { CallCenterModule } from '../call-center/call-center.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: DELAYED_PATROL_CALL_QUEUE },
      { name: DELAYED_PATROL_SMS_QUEUE },
    ),
    CallCenterModule,
  ],
  exports: [BullModule],
  providers: [DelayedPatrolCallConsumer, DelayedPatrolSMSConsumer],
})
export class QueueModule {}
