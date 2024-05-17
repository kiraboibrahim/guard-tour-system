import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import {
  _IsUnique,
  _AreUnique,
  _LoadEntityIfExists,
  _LoadEntitiesIfExist,
  IsAtLeastNYears,
} from './core.validators';
import { SMSService } from './services/sms.service';
import { TasksModule } from '../tasks/tasks.module';

const validators = [
  _IsUnique,
  _AreUnique,
  _LoadEntityIfExists,
  _LoadEntitiesIfExist,
  IsAtLeastNYears,
];
@Global()
@Module({
  imports: [AuthModule, PermissionsModule, RolesModule, TasksModule],
  providers: [SMSService, ...validators],
  exports: [
    AuthModule,
    RolesModule,
    PermissionsModule,
    SMSService,
    ...validators,
  ],
})
export class CoreModule {}
