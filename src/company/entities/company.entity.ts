import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

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

  @Column({ nullable: true })
  logo: string;
}
