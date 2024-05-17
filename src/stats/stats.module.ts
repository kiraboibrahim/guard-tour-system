import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyAdmin } from '../user/entities/company-admin.entity';
import { SiteAdmin } from '../user/entities/site-admin.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Site } from '../site/entities/site.entity';
import { Company } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      CompanyAdmin,
      SiteAdmin,
      SecurityGuard,
      Site,
      Tag,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
