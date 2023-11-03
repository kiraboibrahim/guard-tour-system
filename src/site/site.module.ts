import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site } from './entities/site.entity';
import { DeviceModule } from '../device/device.module';
import { PatrolModule } from '../patrol/patrol.module';
import { ShiftModule } from '../shift/shift.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site]),
    DeviceModule,
    PatrolModule,
    ShiftModule,
  ],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [TypeOrmModule],
})
export class SiteModule {}
