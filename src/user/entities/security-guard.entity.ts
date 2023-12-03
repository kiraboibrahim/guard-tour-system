import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Shift } from '../../shift/entities/shift.entity';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { CompanyUser, User } from './user.base.entity';
import { Site } from '../../site/entities/site.entity';
import { Exclude, Expose } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';

@Entity('securityGuards')
export class SecurityGuard extends CompanyUser {
  @Expose({ name: 'id' })
  @PrimaryColumn()
  userId: number;

  @Exclude()
  @OneToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  companyId: number;

  @Exclude()
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  gender: string;

  @Column({ unique: true })
  uniqueId: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column()
  armedStatus: boolean;

  @Column({ nullable: true })
  deployedSiteId: number | null;

  @Exclude()
  @ManyToOne(() => Site, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  deployedSite: Site;

  @Column({ nullable: true })
  shiftId: number | null;

  @Exclude()
  @ManyToOne(() => Shift, (shift) => shift.securityGuards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  shift: Shift;

  @OneToMany(() => Patrol, (patrol) => patrol.securityGuard)
  patrols: Patrol;

  isDeployedToSite(siteId: number) {
    return this.deployedSiteId === siteId;
  }

  isInShift(shiftId: number) {
    return this.shiftId === shiftId;
  }
  hasNoShift() {
    return this.shiftId === null;
  }
  isNotDeployed() {
    return this.deployedSiteId === null;
  }
  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }
}
