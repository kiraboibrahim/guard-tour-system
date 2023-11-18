import { forwardRef, Module } from '@nestjs/common';
import { PatrolPlanService } from './patrol-plan.service';
import { PatrolPlanController } from './patrol-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GroupPatrolPlan,
  IndividualPatrolPlan,
  PatrolPlan,
} from './entities/patrol-plan.entity';
import { TagModule } from '../tag/tag.module';
import { UserModule } from '../user/user.module';
import { SiteModule } from '../site/site.module';
import { ShiftModule } from '../shift/shift.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatrolPlan,
      IndividualPatrolPlan,
      GroupPatrolPlan,
    ]),
    TagModule,
    forwardRef(() => UserModule),
    forwardRef(() => SiteModule),
    forwardRef(() => ShiftModule),
  ],
  controllers: [PatrolPlanController],
  providers: [PatrolPlanService],
  exports: [TypeOrmModule, PatrolPlanService],
})
export class PatrolPlanModule {}
