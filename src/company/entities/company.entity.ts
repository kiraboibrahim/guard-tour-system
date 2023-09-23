import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  registrationNumber: string;

  @Column()
  name: string;

  @Column()
  address: string;
}