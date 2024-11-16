import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site } from './entities/site.entity';
import { TagModule } from '@tag/tag.module';
import { PatrolModule } from '@patrol/patrol.module';
import { DelayedPatrolNotification } from './entities/delayed-patrol-notification.entity';
import { SecurityGuardModule } from '@security-guard/security-guard.module';
import { CallLog } from '../call-center/entities/call-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, DelayedPatrolNotification, CallLog]),
    TagModule,
    PatrolModule,
    SecurityGuardModule,
  ],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [TypeOrmModule, SiteService],
})
export class SiteModule {}
