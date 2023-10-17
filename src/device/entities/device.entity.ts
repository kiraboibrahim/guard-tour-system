import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsPhoneNumber } from 'class-validator';
import { Site } from '../../site/entities/site.entity';
import { PatrolPlan } from '../../patrol-plan/entities/patrol-plan.entity';
import { Exclude } from 'class-transformer';

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
  @IsPhoneNumber('UG')
  phoneNumber: string;

  @Column({ unique: true })
  simId: string;

  @Exclude()
  @Column()
  siteId: number;

  @ManyToOne(() => Site, { nullable: true, onDelete: 'SET NULL' })
  site: Site;

  @Column({ nullable: true })
  patrolPlanId: number | null;

  @ManyToOne(() => PatrolPlan, (patrolPlan) => patrolPlan.devices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  patrolPlan: PatrolPlan;
}
