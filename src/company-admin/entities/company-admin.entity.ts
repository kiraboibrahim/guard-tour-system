import { Entity } from 'typeorm';

import { AuthCompanyUser } from '@user/entities/company-user.base.entity';
import { Site } from '@site/entities/site.entity';

@Entity()
export class CompanyAdmin extends AuthCompanyUser {
  static async forSite(site: Site) {
    const CACHE_DURATION = 24 * 3600 * 1000; // A DAY
    return await this.find({
      where: { companyId: site.companyId },
      cache: CACHE_DURATION,
    });
  }
}
