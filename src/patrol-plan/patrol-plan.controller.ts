import { Controller, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatrolPlanService } from './patrol-plan.service';
import { UpdatePatrolPlanDto } from './dto/update-patrol-plan.dto';

@Controller('patrol-plan')
export class PatrolPlanController {
  constructor(private readonly patrolPlanService: PatrolPlanService) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatrolPlanDto: UpdatePatrolPlanDto,
  ) {
    return this.patrolPlanService.update(+id, updatePatrolPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrolPlanService.remove(+id);
  }
}
