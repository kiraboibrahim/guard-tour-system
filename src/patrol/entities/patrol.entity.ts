import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsISO8601, IsMilitaryTime } from 'class-validator';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Exclude } from 'class-transformer';

@Entity('patrols')
export class Patrol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsISO8601()
  date: string;

  @Column({ type: 'time' })
  @IsMilitaryTime()
  startTime: string;

  @Exclude()
  @Column()
  siteId: number;

  @ManyToOne(() => Site, { onDelete: 'CASCADE', eager: true })
  site: Site;

  // TODO: Remove nullable: true after updating the database
  @Column({ nullable: true })
  securityGuardUniqueId: string;

  @Exclude()
  @Column({ nullable: true })
  securityGuardId: number;

  @ManyToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrols, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  securityGuard: SecurityGuard;

  belongsToCompany(companyId: number) {
    return this.site.belongsToCompany(companyId);
  }
}
