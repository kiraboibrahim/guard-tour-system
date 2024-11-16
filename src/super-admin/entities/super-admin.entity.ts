import { Entity } from 'typeorm';

import { BaseAuthUser } from '@user/entities/auth-user.base.entity';

@Entity()
export class SuperAdmin extends BaseAuthUser {}
