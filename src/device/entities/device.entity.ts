import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Validate } from 'class-validator';
import { Site } from '../../site/entities/site.entity';
import { PatrolPlan } from '../../patrol-plan/entities/patrol-plan.entity';
import { Exclude } from 'class-transformer';
import { IsUGPhoneNumber } from '../../core/core.validators';
import { Shift } from '../../shift/entities/shift.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column({ unique: true })
  serialNumber: string;

  @Column({ unique: true })
  partNumber: string;

  @Column({ unique: true })
  IMEI: string;

  @Column()
  @Validate(IsUGPhoneNumber)
  phoneNumber: string;

  @Column({ unique: true })
  simId: string;

  @Column()
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { nullable: true, onDelete: 'SET NULL' })
  site: Site;

  @Column({ nullable: true })
  patrolPlanId: number | null;

  @Exclude()
  @ManyToOne(() => PatrolPlan, (patrolPlan) => patrolPlan.devices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  patrolPlan: PatrolPlan;

  belongsToSite(siteOrId: Site | number) {
    return siteOrId instanceof Site
      ? this.siteId === siteOrId.id
      : this.siteId === siteOrId;
  }
}
