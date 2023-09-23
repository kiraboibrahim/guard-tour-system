import { Module } from '@nestjs/common';
import { SuperAdminController } from './controllers/super-admin.controller';
import { CompanyAdminController } from './controllers/company-admin.controller';
import { SiteAdminController } from './controllers/site-admin.controller';
import { SecurityGuardController } from './controllers/security-guard.controller';

import { SuperAdminService } from './services/super-admin.service';
import { CompanyAdminService } from './services/company-admin.service';
import { SiteAdminService } from './services/site-admin.service';
import { SecurityGuardService } from './services/security-guard.service';

@Module({
  controllers: [
    SuperAdminController,
    CompanyAdminController,
    SiteAdminController,
    SecurityGuardController,
  ],
  providers: [
    SuperAdminService,
    CompanyAdminService,
    SiteAdminService,
    SecurityGuardService,
  ],
})
export class UserModule {}
