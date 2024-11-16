import { Test, TestingModule } from '@nestjs/testing';
import { CallCenterController } from './call-center.controller';

describe('CallCenterController', () => {
  let controller: CallCenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallCenterController],
    }).compile();

    controller = module.get<CallCenterController>(CallCenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
