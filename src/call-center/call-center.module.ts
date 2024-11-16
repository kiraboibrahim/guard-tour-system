import { Module } from '@nestjs/common';
import { CallCenterService } from './call-center.service';
import { CallService } from './call.service';
import { CallCenterController } from './call-center.controller';

@Module({
  providers: [CallCenterService, CallService],
  exports: [CallCenterService],
  controllers: [CallCenterController],
})
export class CallCenterModule {}
