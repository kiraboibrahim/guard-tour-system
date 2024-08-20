import { Entity } from 'typeorm';
import { BaseAuthUser } from '../../user/entities/user.base.entity';

@Entity()
export class SuperAdmin extends BaseAuthUser {}
