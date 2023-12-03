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
import { Shift } from '../../shift/entities/shift.entity';
import { Tag } from '../../tag/entities/tag.entity';

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
  patrolType: string;

  @Column()
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site, {
    nullable: true,
    eager: true,
  })
  admin: SiteAdmin;

  @OneToMany(() => Shift, (shift) => shift.site)
  shifts: Shift[];

  @OneToMany(() => Tag, (tag) => tag.site)
  tags: Tag[];

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }
}
