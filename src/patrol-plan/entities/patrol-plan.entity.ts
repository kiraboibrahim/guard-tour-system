import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { SecurityGuard } from '../../user/entities/security-guard.entity';
import { Site } from '../../site/entities/site.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Shift } from '../../shift/entities/shift.entity';
import { IsValidPatrolPlanType } from '../patrol-plan.validators';

// A set of tags to be patrolled
@Entity('patrolPlans')
export class PatrolPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => Tag, (tag) => tag.patrolPlan, { eager: true })
  tags: Tag[];

  @Column()
  @IsValidPatrolPlanType()
  patrolPlanType: string;

  belongsToCompany(companyId: number) {
    return this.site.belongsToCompany(companyId);
  }
}

@Entity('individualPatrolPlans')
export class IndividualPatrolPlan {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  patrolPlanId: number;

  @Exclude()
  @OneToOne(() => PatrolPlan, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patrolPlan: PatrolPlan;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  siteId: number;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  tags: Tag[];

  @Column()
  securityGuardId: number;

  @Exclude()
  @OneToOne(() => SecurityGuard, (securityGuard) => securityGuard.patrolPlan, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  securityGuard: SecurityGuard;
}

@Entity('groupPatrolPlans')
export class GroupPatrolPlan {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  patrolPlanId: number;

  @Exclude()
  @OneToOne(() => PatrolPlan, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patrolPlan: PatrolPlan;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  siteId: number;

  @Expose()
  @Transform(({ obj, key }) => obj.patrolPlan[key])
  tags: Tag[];

  @Column()
  shiftId: number;

  @Exclude()
  @OneToOne(() => Shift, (shift) => shift.patrolPlan, { onDelete: 'CASCADE' })
  @JoinColumn()
  shift: Shift;

  @BeforeInsert()
  setShiftId() {
    this.shiftId = this.shift.id;
  }
}
