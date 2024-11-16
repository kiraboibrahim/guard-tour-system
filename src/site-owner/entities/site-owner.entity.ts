import { Entity, OneToMany } from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { BaseAuthUser } from '@user/entities/auth-user.base.entity';

@Entity()
export class SiteOwner extends BaseAuthUser {
  @OneToMany(() => Site, (site) => site.owner)
  sites: Site[];
}
