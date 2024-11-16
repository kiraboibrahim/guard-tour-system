import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CallStatus } from './call-center.types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const twilio = require('twilio');

@Injectable()
export class CallService {
  private readonly logger = new Logger(CallService.name);
  private readonly callClient;
  constructor(private configService: ConfigService) {
    this.callClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async call(to: string, response: string) {
    try {
      const _call = await this.callClient.calls.create({
        from: this.configService.get('TWILIO_PHONE_NUMBER') as string,
        to,
        twiml: response,
      });
      return await this.getCallStatus(_call.sid);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async getCallStatus(sid: any): Promise<CallStatus> {
    return new Promise((resolve) => {
      const POLLING_INTERVAL = 100;
      (function _getCallStatus(client) {
        setTimeout(async () => {
          const call = await client.calls(sid).fetch();
          if (CallStatus.isEndedStatus(call.status)) {
            resolve(new CallStatus(call.status));
            return;
          }
          setTimeout(_getCallStatus, POLLING_INTERVAL, client);
        }, POLLING_INTERVAL);
      })(this.callClient);
    });
  }
}
