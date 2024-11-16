import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SMS_SENT, TRUE_AFRICAN_SMS_SEND_URL } from './trueafrican.constants';
import { isUGPhoneNumber } from '@core/core.utils';

export default class TrueAfricanSMS {
  private readonly proxyAgent: HttpsProxyAgent<any>;
  constructor(
    private username: string,
    private password: string,
    private proxyURL?: string,
  ) {
    if (this.proxyURL !== undefined) {
      this.proxyAgent = new HttpsProxyAgent<any>(this.proxyURL);
    }
  }

  async send(recipientPhoneNumbers: string[], message: string) {
    const _recipientPhoneNumbers = recipientPhoneNumbers.map(
      (recipientPhoneNumber) =>
        this.isUGPhoneNumber(this.removeLeadingPluses(recipientPhoneNumber)),
    );
    return Promise.any(
      _recipientPhoneNumbers.map((recipientPhoneNumber) =>
        this.sendToOneRecipient(recipientPhoneNumber, message),
      ),
    );
  }

  private async sendToOneRecipient(
    recipientPhoneNumber: string,
    message: string,
  ) {
    const payload = {
      msisdn: [recipientPhoneNumber],
      message: message,
      username: this.username,
      password: this.password,
    };
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(TRUE_AFRICAN_SMS_SEND_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: headers,
      agent: this.proxyAgent,
    });
    if (!response.ok) {
      throw new Error(
        `Server responded with error code: ${response.status}: ${response.statusText}`,
      );
    }
    const data = (await response.json()) as any;
    if (data.code !== SMS_SENT) {
      const errorMessage = data.message || data.error;
      throw new Error(`${data.code}: ${errorMessage}`);
    }
  }
  private isUGPhoneNumber(phoneNumber: string) {
    const isValid = isUGPhoneNumber(phoneNumber);
    if (!isValid) {
      throw new Error('Invalid phone number');
    }
    return phoneNumber;
  }
  private removeLeadingPluses(phoneNumber: string) {
    const LEADING_PLUSES = /^\++/;
    return phoneNumber.replace(LEADING_PLUSES, '');
  }
}
