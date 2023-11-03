import { Controller, Body, Patch, Param, Delete, Post } from '@nestjs/common';
import { PatrolPlanService } from './patrol-plan.service';
import { UpdatePatrolPlanDto } from './dto/update-patrol-plan.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePatrolPlanDto } from './dto/create-patrol-plan.dto';

@ApiTags('Patrol Plans')
@Controller('patrol-plans')
export class PatrolPlanController {
  constructor(private readonly patrolPlanService: PatrolPlanService) {}

  @Post()
  async create(@Body() createPatrolPlanDto: CreatePatrolPlanDto) {
    return await this.patrolPlanService.create(createPatrolPlanDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatrolPlanDto: UpdatePatrolPlanDto,
  ) {
    await this.patrolPlanService.update(+id, updatePatrolPlanDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.patrolPlanService.remove(+id);
  }
}
