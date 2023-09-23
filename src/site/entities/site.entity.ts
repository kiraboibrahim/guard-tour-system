import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { IsPhoneNumber, IsLongitude, IsLatitude } from 'class-validator';
import { Company } from '../../company/entities/company.entity';
import { SiteAdmin } from '../../user/entities/site-admin.entity';

@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  @IsLatitude()
  latitude: number;

  @Column({ type: 'decimal' })
  @IsLongitude()
  longitude: number;

  @Column()
  @IsPhoneNumber('UG')
  phoneNumber: string;

  @Column()
  supervisorName: string;

  @Column()
  @IsPhoneNumber('UG')
  supervisorPhoneNumber: string;

  @ManyToOne(() => Company)
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site)
  admin: SiteAdmin;
}
