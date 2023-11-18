import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { PatrolPlan } from '../../patrol-plan/entities/patrol-plan.entity';
import { Exclude } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Exclude()
  @Column()
  companyId: number;

  @Exclude()
  @ManyToOne(() => Company, { nullable: true, onDelete: 'CASCADE' })
  company: Company;

  @Column({ nullable: true })
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { nullable: true, onDelete: 'SET NULL' })
  site: Site;

  @Exclude()
  @Column({ nullable: true })
  patrolPlanId: number | null;

  @Exclude()
  @ManyToOne(() => PatrolPlan, (patrolPlan) => patrolPlan.tags, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  patrolPlan: PatrolPlan;

  belongsToCompany(companyId: number) {
    return (this.companyId = companyId);
  }
}
