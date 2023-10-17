import { Test, TestingModule } from '@nestjs/testing';
import { PatrolPlanService } from './patrol-plan.service';

describe('PatrolPlanService', () => {
  let service: PatrolPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrolPlanService],
    }).compile();

    service = module.get<PatrolPlanService>(PatrolPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
