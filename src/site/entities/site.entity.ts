import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { SiteAdmin } from '../../user/entities/site-admin.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Exclude } from 'class-transformer';

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

  @Column()
  supervisorName: string;

  @Column()
  supervisorPhoneNumber: string;

  @Exclude()
  @Column()
  companyId: number;

  // TODO: Remember to set nullable to false after population this field for the existing records in DB.
  @Column({ nullable: true })
  requiredPatrolsPerGuard: number;

  // TODO: Remember to set nullable to false after population this field for the existing records in DB.
  @Column({ nullable: true, type: 'decimal' })
  notificationCycle: number;

  @ManyToOne(() => Company, { eager: true })
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site, {
    nullable: true,
    eager: true,
  })
  admin: SiteAdmin;

  @OneToMany(() => Tag, (tag) => tag.site)
  tags: Tag[];

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }
}
