import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Site } from './site.entity';
import { IsISO8601, IsMilitaryTime } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class PatrolDelayNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'date' })
  @IsISO8601()
  dateCreatedAt: string;

  @Column()
  @IsMilitaryTime()
  timeCreatedAt: string;

  @Exclude()
  @Column()
  siteId: number;

  @ManyToOne(() => Site, { eager: true })
  site: Site;
}
