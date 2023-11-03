import { forwardRef, Module } from '@nestjs/common';
import { PatrolPlanService } from './patrol-plan.service';
import { PatrolPlanController } from './patrol-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GroupPatrolPlan,
  IndividualPatrolPlan,
  PatrolPlan,
} from './entities/patrol-plan.entity';
import { DeviceModule } from '../device/device.module';
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
    DeviceModule,
    forwardRef(() => UserModule),
    forwardRef(() => SiteModule),
    forwardRef(() => ShiftModule),
  ],
  controllers: [PatrolPlanController],
  providers: [PatrolPlanService],
  exports: [TypeOrmModule],
})
export class PatrolPlanModule {}
