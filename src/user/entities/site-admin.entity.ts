import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AuthCompanyUser } from './user.base.entity';
import { Site } from '../../site/entities/site.entity';

@Entity('siteAdmins')
export class SiteAdmin extends AuthCompanyUser {
  @Column({ unique: true })
  email: string;

  @Column()
  siteId: number;

  @OneToOne(() => Site, (site) => site.admin)
  @JoinColumn()
  site: Site;
}
