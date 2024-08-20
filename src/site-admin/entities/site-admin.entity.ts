import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseAuthCompanyUser } from '../../user/entities/user.base.entity';
import { Site } from '../../site/entities/site.entity';

@Entity()
export class SiteAdmin extends BaseAuthCompanyUser {
  @Column()
  siteId: number;

  @OneToOne(() => Site, (site) => site.admin)
  @JoinColumn()
  site: Site;
}
