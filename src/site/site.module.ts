import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site } from './entities/site.entity';
import { TagModule } from '../tag/tag.module';
import { PatrolModule } from '../patrol/patrol.module';
import { PatrolDelayNotification } from './entities/patrol-delay-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, PatrolDelayNotification]),
    TagModule,
    PatrolModule,
  ],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [TypeOrmModule, SiteService],
})
export class SiteModule {}
