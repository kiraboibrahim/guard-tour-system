import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { Exclude } from 'class-transformer';
import { Company } from '../../company/entities/company.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @Exclude()
  @Column()
  companyId: number;

  @Exclude()
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @Column({ nullable: true })
  siteId: number | null;

  @Exclude()
  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  belongsToCompany(companyId: number) {
    return (this.companyId = companyId);
  }
}
