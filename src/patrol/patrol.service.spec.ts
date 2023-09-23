import { Test, TestingModule } from '@nestjs/testing';
import { PatrolService } from './patrol.service';

describe('PatrolService', () => {
  let service: PatrolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrolService],
    }).compile();

    service = module.get<PatrolService>(PatrolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
