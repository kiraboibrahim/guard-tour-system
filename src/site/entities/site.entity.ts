import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { SiteAdmin } from '../../user/entities/site-admin.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  patrolPlanType: string;

  @Column()
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site, {
    nullable: true,
    eager: true,
  })
  admin: SiteAdmin;

  belongsToCompany(companyOrId: Company | number) {
    return companyOrId instanceof Company
      ? this.companyId === companyOrId.id
      : this.companyId === companyOrId;
  }
}
