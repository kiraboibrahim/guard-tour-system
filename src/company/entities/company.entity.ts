import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { Theme } from '@company/entities/theme.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true, type: 'text' })
  logo: string | null;

  @OneToOne(() => Theme, (theme) => theme.company, {
    eager: true,
  })
  theme: Theme;
}
