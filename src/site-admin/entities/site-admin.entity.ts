import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Site } from '../../site/entities/site.entity';

import { AuthCompanyUser } from '@user/entities/company-user.base.entity';

@Entity()
export class SiteAdmin extends AuthCompanyUser {
  @Column()
  siteId: number;

  @OneToOne(() => Site, (site) => site.admin)
  @JoinColumn()
  site: Site;
}
