import { Body, Controller, Param, Post } from '@nestjs/common';
import { CallCenterService } from './call-center.service';

@Controller('call-center')
export class CallCenterController {
  constructor(private callCenterService: CallCenterService) {}
  @Post('test')
  async testCall() {
    await this.callCenterService.testCallCenter();
  }

  @Post('gather/:callLogId')
  async gather(@Body() body: any, @Param('callLogId') callLogId: string) {
    return await this.callCenterService.handleCallResponse(
      +callLogId,
      body.Digits,
    );
  }
}
