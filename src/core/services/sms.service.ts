import TrueAfricanSMS from '../../libs/trueafrican/trueafricansms.lib';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SMSService {
  private readonly username: string;
  private readonly password: string;
  private readonly trueAfricanSMS: TrueAfricanSMS;
  private readonly logger = new Logger(SMSService.name);

  constructor(private configService: ConfigService) {
    this.username = this.configService.get<string>(
      'TRUE_AFRICAN_SMS_USERNAME',
    ) as string;
    this.password = this.configService.get<string>(
      'TRUE_AFRICAN_SMS_PASSWORD',
    ) as string;
    const PROXY_USERNAME = this.configService.get<string>('PROXY_USERNAME');
    const PROXY_PASSWORD = this.configService.get<string>('PROXY_PASSWORD');
    const PROXY_IP = this.configService.get<string>('PROXY_IP');
    const PROXY_PORT = this.configService.get<string>('PROXY_PORT');
    const proxyURL = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_IP}:${PROXY_PORT}`;
    this.trueAfricanSMS = new TrueAfricanSMS(
      this.username,
      this.password,
      proxyURL,
    );
  }

  async send(recipientNumbers: string[], message: string) {
    try {
      await this.trueAfricanSMS.send(recipientNumbers, message);
    } catch (err) {
      this.logger.error(err.message);
    }
  }
}
