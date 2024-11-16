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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const VoiceResponse = require('twilio').twiml.VoiceResponse;

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
    const SPEAKING_RATE = '65%';
    const PAUSE_DURATION = 1; // Seconds
    const twiml = new VoiceResponse();

    const action = (
      this.configService.get<string>('TWILIO_GATHER_ACTION') as string
    )?.replace(/\/+$/g, '');
    if (action === undefined) {
      throw new Error("TWILIO_GATHER_ACTION variable isn't set");
    }
    const gather = twiml.gather({
      numDigits: 1,
      action: `${action}/${callLog.id}`,
    });
    const introduction =
      'Patrols have been delayed on this site.' +
      'Please listen to the instructions carefully.';
    const firstInstruction = 'Press 1 for lack of a data bundle on the device';
    const secondInstruction =
      'Press 2 for any other issue with the patrol device or system';
    const thirdInstruction =
      'Hang up if there are no issues with submitting patrols';

    gather.pause({ length: PAUSE_DURATION });
    gather.say({ rate: SPEAKING_RATE }, introduction);
    gather.pause({ length: PAUSE_DURATION });
    gather.say({ rate: SPEAKING_RATE }, firstInstruction);
    gather.pause({ length: PAUSE_DURATION });
    gather.say({ rate: SPEAKING_RATE }, secondInstruction);
    gather.pause({ length: PAUSE_DURATION });
    gather.say({ rate: SPEAKING_RATE }, thirdInstruction);
    return twiml.toString();
  }

  async handleCallResponse(callLogId: number, response: string) {
    await CallLog.updateResponse(callLogId, response);
    const twiml = new VoiceResponse();
    twiml.say('Your response has been recorded, Thank you');
    twiml.pause({ length: 2 });
    twiml.hangup();
    return twiml.toString();
  }

  async testCallCenter() {
    const site = await Site.findOneOrFail({ where: { id: 2 } });
    await this.delayedPatrolCallQueue.add(DELAYED_PATROL_CALL_QUEUE_TASK, {
      site,
    });
  }
}
