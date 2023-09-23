import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsPhoneNumber } from 'class-validator';
import { Site } from '../../site/entities/site.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  serialNumber: string;

  @Column()
  partNumber: string;

  @Column()
  IMEI: string;

  @Column()
  @IsPhoneNumber('UG')
  phoneNumber: string;

  @Column()
  simId: string;

  @ManyToOne(() => Site, { nullable: true })
  site: Site;
}
