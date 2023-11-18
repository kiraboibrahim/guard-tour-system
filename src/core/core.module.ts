import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import {
  _IsUnique,
  _IsExists,
  _IsExistsAndLoadEntity,
  IsAtleastXYears,
} from './core.validators';

@Global()
@Module({
  imports: [AuthModule, PermissionsModule, RolesModule],
  providers: [_IsUnique, _IsExists, _IsExistsAndLoadEntity, IsAtleastXYears],
  exports: [
    AuthModule,
    RolesModule,
    PermissionsModule,
    IsAtleastXYears,
    _IsUnique,
    _IsExists,
    _IsExistsAndLoadEntity,
  ],
})
export class CoreModule {}
