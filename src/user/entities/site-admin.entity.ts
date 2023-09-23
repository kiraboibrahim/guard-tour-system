import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CompanyUser } from './user.base.entity';
import { IsEmail } from 'class-validator';
import { Site } from '../../site/entities/site.entity';
import { SITE_ADMIN_ROLE } from '../../roles/constants';

@Entity()
export class SiteAdmin extends CompanyUser {
  role = SITE_ADMIN_ROLE;

  @Column()
  @IsEmail()
  email: string;

  @OneToOne(() => Site, (site) => site.admin)
  @JoinColumn()
  site: Site;
}
