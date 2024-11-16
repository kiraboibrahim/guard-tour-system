import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from '@site/entities/site.entity';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';

@Entity()
export class Shift extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @ManyToOne(() => Site, { eager: true, onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => SecurityGuard, (securityGuard) => securityGuard.shift, {
    eager: true,
  })
  securityGuards: SecurityGuard[];
}
