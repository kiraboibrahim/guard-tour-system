import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { IsPhoneNumber, IsLongitude, IsLatitude, IsIn } from 'class-validator';
import { Company } from '../../company/entities/company.entity';
import { SiteAdmin } from '../../user/entities/site-admin.entity';
import {
  INDIVIDUAL_PATROL_PLAN,
  GROUP_PATROL_PLAN,
} from '../../patrol-plan/patrol-plan.constants';

@Entity('sites')
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

  @Column()
  @IsIn([INDIVIDUAL_PATROL_PLAN, GROUP_PATROL_PLAN])
  patrolPlanSetting: number;

  @Column()
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;

  @OneToOne(() => SiteAdmin, (siteAdmin) => siteAdmin.site, {
    nullable: true,
    eager: true,
  })
  admin: SiteAdmin;
}
