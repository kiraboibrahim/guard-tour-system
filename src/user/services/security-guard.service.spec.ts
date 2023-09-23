import { Test, TestingModule } from '@nestjs/testing';
import { SecurityGuardService } from './security-guard.service';

describe('SecurityGuardService', () => {
  let service: SecurityGuardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityGuardService],
    }).compile();

    service = module.get<SecurityGuardService>(SecurityGuardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
