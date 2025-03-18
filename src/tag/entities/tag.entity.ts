import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Site } from '@site/entities/site.entity';
import { Exclude } from 'class-transformer';
import { Company } from '@company/entities/company.entity';

@Entity()
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
  siteId: number;

  @Exclude()
  @ManyToOne(() => Site, { onDelete: 'SET NULL' })
  site: Site | null;

  belongsToCompany(companyId: number) {
    return this.companyId === companyId;
  }
}
