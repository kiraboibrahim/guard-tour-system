import { Injectable, Logger } from '@nestjs/common';
import { Site } from '@site/entities/site.entity';
import { InjectQueue } from '@nestjs/bullmq';
import {
  DELAYED_PATROL_CALL_QUEUE,
  DELAYED_PATROL_CALL_QUEUE_TASK,
  DELAYED_PATROL_SMS_QUEUE,
  DELAYED_PATROL_SMS_QUEUE_TASK,
} from '../queue/queue.constants';
import { Queue } from 'bullmq';
import { CallService } from './call.service';
import { CallLog } from './entities/call-log.entity';
import { ConfigService } from '@nestjs/config';
import {
  getOnCallAnsweredResponse,
  getOnCallEndedResponse,
} from './call-center.response';

@Injectable()
export class CallCenterService {
  private readonly logger = new Logger(CallCenterService.name);
  constructor(
    private callService: CallService,
    private configService: ConfigService,
    @InjectQueue(DELAYED_PATROL_SMS_QUEUE) private delayedPatrolSMSQueue: Queue,
    @InjectQueue(DELAYED_PATROL_CALL_QUEUE)
    private delayedPatrolCallQueue: Queue,
  ) {}

  async callSite(site: Site) {
    const callLog = await CallLog.createLog(site);
    const securityGuards = await Site.findActiveSecurityGuards(site);
    for (const securityGuard of securityGuards) {
      const callStatus = await this.callService.call(
        securityGuard.getPhoneNumber(),
        this.getCallResponse(callLog),
      );
      if (callStatus?.isCompleted()) {
        await CallLog.setIsAnswered(callLog.id, securityGuard);
        break;
      }
    }
    return !callLog.isAnswered
      ? this.delayedPatrolSMSQueue.add(DELAYED_PATROL_SMS_QUEUE_TASK, { site })
      : null;
  }

  private getCallResponse(callLog: CallLog) {
    const actionBaseUrl = (
      this.configService.get<string>('TWILIO_GATHER_ACTION') as string
    )?.replace(/\/+$/g, '');
    if (actionBaseUrl === undefined) {
      throw new Error("TWILIO_GATHER_ACTION variable isn't set");
    }
    const action = `${actionBaseUrl}/${callLog.id}`;
    return getOnCallAnsweredResponse(action);
  }

  async handleOnCallAnsweredResponse(callLogId: number, response: string) {
    await CallLog.updateResponse(callLogId, response);
    return getOnCallEndedResponse();
  }

  async testCallCenter(siteId: number) {
    const site = await Site.findOneOrFail({ where: { id: siteId } });
    await this.delayedPatrolCallQueue.add(DELAYED_PATROL_CALL_QUEUE_TASK, {
      site,
    });
  }
}
