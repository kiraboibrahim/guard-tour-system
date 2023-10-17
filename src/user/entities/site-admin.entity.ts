import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CompanyUser } from './user.base.entity';
import { IsEmail } from 'class-validator';
import { Site } from '../../site/entities/site.entity';

@Entity('siteAdmins')
export class SiteAdmin extends CompanyUser {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  siteId: number;

  @OneToOne(() => Site, (site) => site.admin)
  @JoinColumn()
  site: Site;
}
