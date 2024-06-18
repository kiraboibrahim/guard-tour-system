import { Entity } from 'typeorm';
import { BaseAuthUser } from '../../user/entities/user.base.entity';

@Entity('superAdmins')
export class SuperAdmin extends BaseAuthUser {}
