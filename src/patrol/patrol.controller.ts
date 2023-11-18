import { Controller, Post, Body } from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired } from '../auth/auth.decorators';
import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SUPER_ADMIN_ROLE,
} from '../roles/roles.constants';
import { CanCreate } from '../permissions/permissions.decorators';
import { PATROL_RESOURCE } from '../permissions/permissions';
import { AllowOnly } from '../roles/roles.decorators';
import { User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';

@ApiTags('Patrols')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('patrols')
export class PatrolController {
  constructor(private readonly patrolService: PatrolService) {}

  @Post()
  @AllowOnly(SECURITY_GUARD_ROLE)
  @CanCreate(PATROL_RESOURCE)
  create(
    @Body() createPatrolDto: CreatePatrolDto,
    @User() user: AuthenticatedUser,
  ) {
    this.patrolService.setUser(user);
    return this.patrolService.create(createPatrolDto);
  }
}
