import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  Get,
} from '@nestjs/common';
import { PatrolPlanService } from './patrol-plan.service';
import { UpdatePatrolPlanDto } from './dto/update-patrol-plan.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePatrolPlanDto } from './dto/create-patrol-plan.dto';
import { AuthRequired, User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { COMPANY_ADMIN_ROLE, SUPER_ADMIN_ROLE } from '../roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { PATROL_PLAN_RESOURCE } from '../permissions/permissions';

@ApiTags('Patrol Plans')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('patrol-plans')
export class PatrolPlanController {
  constructor(private readonly patrolPlanService: PatrolPlanService) {}

  @Post()
  @CanCreate(PATROL_PLAN_RESOURCE)
  async create(
    @Body() createPatrolPlanDto: CreatePatrolPlanDto,
    @User() user: AuthenticatedUser,
  ) {
    this.patrolPlanService.setUser(user);
    return await this.patrolPlanService.create(createPatrolPlanDto);
  }

  @Patch(':id')
  @CanUpdate(PATROL_PLAN_RESOURCE)
  async update(
    @Param('id') id: string,
    @Body() updatePatrolPlanDto: UpdatePatrolPlanDto,
  ) {
    await this.patrolPlanService.update(+id, updatePatrolPlanDto);
  }

  @Get(':id')
  @CanRead(PATROL_PLAN_RESOURCE)
  async findOne(@Param('id') id: string) {
    await this.patrolPlanService.findOneById(+id);
  }
  @Delete(':id')
  @CanDelete(PATROL_PLAN_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.patrolPlanService.remove(+id);
  }
}
