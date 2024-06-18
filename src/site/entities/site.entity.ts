import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { SiteAdmin } from '../../site-admin/entities/site-admin.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Exclude } from 'class-transformer';
import { PATROL_TYPE } from '../site.constants';
import { SiteOwner } from '../../site-owner/entities/site-owner.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  tagId: string;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column()
  phoneNumber: string;

  @Exclude()
  @Column()
  companyId: number;

  /* TODO: Remove 'nullable: true' once this field has been updated for all the sites */
  @Column({ nullable: true })
  requiredPatrolsPerGuard: number;

  @Column({ type: 'boolean', default: false })
  notificationsEnabled: boolean;

  /* TODO: Remove 'nullable: true' once this field has been updated for all the sites */
  @Column({ nullable: true, type: 'decimal' })
  notificationCycle: number;

  @ManyToOne(() => Company, { eager: true })
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site, {
    nullable: true,
    eager: true,
  })
  admin: SiteAdmin;

  @Column({ nullable: true })
  ownerId: number;

  @ManyToOne(() => SiteOwner, { nullable: true })
  owner: SiteOwner;

  @OneToMany(() => Tag, (tag) => tag.site)
  tags: Tag[];

  @Column({ default: PATROL_TYPE.INDIVIDUAL })
  patrolType: string;

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }

  hasIndividualPatrolType() {
    return this.patrolType === PATROL_TYPE.INDIVIDUAL;
  }
}
