import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser, User } from './entities/user.base.entity';
import { UserService } from './user.service';
import { CompanyModule } from '../company/company.module';
import { CompanyAdminModule } from '../company-admin/company-admin.module';
import { SecurityGuardModule } from '../security-guard/security-guard.module';
import { SuperAdminModule } from '../super-admin/super-admin.module';
import { SiteAdminModule } from '../site-admin/site-admin.module';
import { SiteOwnerModule } from '../site-owner/site-owner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthUser]),
    SuperAdminModule,
    CompanyAdminModule,
    SiteAdminModule,
    SecurityGuardModule,
    SiteOwnerModule,
    forwardRef(() => CompanyModule),
  ],
  providers: [UserService],
  exports: [
    UserService,
    TypeOrmModule,
    SuperAdminModule,
    CompanyAdminModule,
    SiteAdminModule,
    SecurityGuardModule,
    SiteOwnerModule,
  ],
})
export class UserModule {}
