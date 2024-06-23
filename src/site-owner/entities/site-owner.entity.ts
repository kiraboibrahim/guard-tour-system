import { Entity, OneToMany } from 'typeorm';
import { BaseAuthUser } from '../../user/entities/user.base.entity';
import { Site } from '../../site/entities/site.entity';

@Entity()
export class SiteOwner extends BaseAuthUser {
  @OneToMany(() => Site, (site) => site.owner)
  sites: Site[];
}
