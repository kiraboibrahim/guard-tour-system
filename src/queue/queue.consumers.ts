import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  DELAYED_PATROL_CALL_QUEUE,
  DELAYED_PATROL_SMS_QUEUE,
} from './queue.constants';
import { Job } from 'bullmq';
import { Site } from '@site/entities/site.entity';
import { CallCenterService } from '../call-center/call-center.service';
import { SMSService } from '@core/services/sms.service';
import { CompanyAdmin } from '@company-admin/entities/company-admin.entity';
import { removeDuplicates } from '@core/core.utils';
import { DelayedPatrolNotification } from '@site/entities/delayed-patrol-notification.entity';

@Processor(DELAYED_PATROL_CALL_QUEUE)
export class DelayedPatrolCallConsumer extends WorkerHost {
  constructor(private callCenterService: CallCenterService) {
    super();
  }

  async process(job: Job) {
    /**
     * Be careful when passing objects in the job because the object methods
     * are not preserved due to job serialization
     */
    const { site }: { site: Site } = job.data;
    return await this.callCenterService.callSite(site);
  }
}

@Processor(DELAYED_PATROL_SMS_QUEUE)
export class DelayedPatrolSMSConsumer extends WorkerHost {
  constructor(private smsService: SMSService) {
    super();
  }
  async process(job: Job) {
    const { site }: { site: Site } = job.data;
    const companyAdmins = await CompanyAdmin.forSite(site);
    const companyAdminPhoneNumbers = removeDuplicates(
      companyAdmins.map((admin) => admin.getPhoneNumber()),
    );

    // Save notification before sending sms
    await DelayedPatrolNotification.createForSite(site);
    const message = `The site, ${site.name} hasn't been patrolled for over ${site.notificationCycle} hours`;
    return await this.smsService.send(companyAdminPhoneNumbers, message);
  }
}
