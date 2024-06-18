import { Entity, OneToMany } from 'typeorm';
import { BaseAuthCompanyUser } from '../../user/entities/user.base.entity';
import { Site } from '../../site/entities/site.entity';

@Entity()
export class SiteOwner extends BaseAuthCompanyUser {
  @OneToMany(() => Site, (site) => site.owner)
  sites: Site[];
}
