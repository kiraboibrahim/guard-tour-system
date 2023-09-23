import { Module, Global } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { AuthService } from '../auth/auth.service';

@Global()
@Module({
  imports: [AuthModule, RolesModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class CoreModule {}
