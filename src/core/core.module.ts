import { Module, Global } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { PermissionsModule } from '@permissions/permissions.module';
import { RolesModule } from '@roles/roles.module';
import {
  _IsUnique,
  _AreUnique,
  _LoadEntityIfExists,
  _LoadEntitiesIfExist,
  IsAtLeastNYears,
} from './core.validators';
import { SMSService } from './services/sms.service';
import { StorageModule } from '../storage/storage.module';
import { QueueModule } from '../queue/queue.module';

const validators = [
  _IsUnique,
  _AreUnique,
  _LoadEntityIfExists,
  _LoadEntitiesIfExist,
  IsAtLeastNYears,
];
@Global()
@Module({
  imports: [
    AuthModule,
    PermissionsModule,
    RolesModule,
    StorageModule,
    QueueModule,
  ],
  providers: [SMSService, ...validators],
  exports: [
    AuthModule,
    RolesModule,
    PermissionsModule,
    StorageModule,
    QueueModule,
    SMSService,
    ...validators,
  ],
})
export class CoreModule {}
