import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UserModule } from '../user/user.module';
import { PatrolPlanModule } from '../patrol-plan/patrol-plan.module';
import { ShiftModule } from '../shift/shift.module';
import { TagModule } from '../tag/tag.module';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [TagModule, UserModule, PatrolPlanModule, ShiftModule, SiteModule],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
