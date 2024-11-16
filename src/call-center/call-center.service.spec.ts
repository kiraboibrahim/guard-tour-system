import { Test, TestingModule } from '@nestjs/testing';
import { CallCenterService } from './call-center.service';

describe('CallCenterService', () => {
  let service: CallCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallCenterService],
    }).compile();

    service = module.get<CallCenterService>(CallCenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
