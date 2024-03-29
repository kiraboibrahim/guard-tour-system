import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuperAdminController } from './controllers/super-admin.controller';
import { CompanyAdminController } from './controllers/company-admin.controller';
import { SiteAdminController } from './controllers/site-admin.controller';
import { SecurityGuardController } from './controllers/security-guard.controller';

import { SuperAdminService } from './services/super-admin.service';
import { CompanyAdminService } from './services/company-admin.service';
import { SiteAdminService } from './services/site-admin.service';
import { SecurityGuardService } from './services/security-guard.service';
import { SuperAdmin } from './entities/super-admin.entity';
import { CompanyAdmin } from './entities/company-admin.entity';
import { SiteAdmin } from './entities/site-admin.entity';
import { SecurityGuard } from './entities/security-guard.entity';
import { AuthUser, User } from './entities/user.base.entity';
import { UserService } from './services/user.service';
import { CompanyModule } from '../company/company.module';
import { PatrolModule } from '../patrol/patrol.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AuthUser,
      SuperAdmin,
      CompanyAdmin,
      SiteAdmin,
      SecurityGuard,
    ]),
    PatrolModule,
    forwardRef(() => CompanyModule),
  ],
  controllers: [
    SuperAdminController,
    CompanyAdminController,
    SiteAdminController,
    SecurityGuardController,
  ],
  providers: [
    UserService,
    SuperAdminService,
    CompanyAdminService,
    SiteAdminService,
    SecurityGuardService,
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
