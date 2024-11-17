import { Controller, Param, Post } from '@nestjs/common';
import { CallCenterService } from './call-center.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Call Center')
@Controller('call-center')
export class CallCenterController {
  constructor(private callCenterService: CallCenterService) {}

  @Post(':siteId/test')
  async testCall(@Param('siteId') siteId: string) {
    await this.callCenterService.testCallCenter(+siteId);
  }
}
