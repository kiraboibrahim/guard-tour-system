import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import {
  IsUnique,
  IsExists,
  IsExistsAndLoadEntity,
  IsAtleastXYears,
} from './core.validators';

@Global()
@Module({
  imports: [AuthModule, PermissionsModule, RolesModule],
  providers: [IsUnique, IsExists, IsExistsAndLoadEntity, IsAtleastXYears],
  exports: [
    AuthModule,
    PermissionsModule,
    RolesModule,
    IsUnique,
    IsExists,
    IsExistsAndLoadEntity,
    IsAtleastXYears,
  ],
})
export class CoreModule {}
