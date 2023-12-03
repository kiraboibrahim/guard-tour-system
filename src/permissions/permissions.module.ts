import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UserModule } from '../user/user.module';
import { ShiftModule } from '../shift/shift.module';
import { TagModule } from '../tag/tag.module';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [TagModule, UserModule, ShiftModule, SiteModule],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
