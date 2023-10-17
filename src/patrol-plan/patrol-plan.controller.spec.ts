import { Test, TestingModule } from '@nestjs/testing';
import { PatrolPlanController } from './patrol-plan.controller';
import { PatrolPlanService } from './patrol-plan.service';

describe('PatrolPlanController', () => {
  let controller: PatrolPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrolPlanController],
      providers: [PatrolPlanService],
    }).compile();

    controller = module.get<PatrolPlanController>(PatrolPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
