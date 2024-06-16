import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { CompanyModule } from '../company/company.module';
import { CompanyAdminModule } from '../company-admin/company-admin.module';
import { SiteAdminModule } from '../site-admin/site-admin.module';
import { SecurityGuardModule } from '../security-guard/security-guard.module';
import { SiteModule } from '../site/site.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    CompanyModule,
    CompanyAdminModule,
    SiteAdminModule,
    SecurityGuardModule,
    SiteModule,
    TagModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
