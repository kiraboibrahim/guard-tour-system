import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import {
  _IsUnique,
  _AreUnique,
  _LoadEntityIfExists,
  _LoadEntitiesIfExist,
  IsAtleastXYears,
} from './core.validators';

const validators = [
  _IsUnique,
  _AreUnique,
  _LoadEntityIfExists,
  _LoadEntitiesIfExist,
  IsAtleastXYears,
];
@Global()
@Module({
  imports: [AuthModule, PermissionsModule, RolesModule],
  providers: [...validators],
  exports: [AuthModule, RolesModule, PermissionsModule, ...validators],
})
export class CoreModule {}
