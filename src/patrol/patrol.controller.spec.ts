import { Test, TestingModule } from '@nestjs/testing';
import { PatrolController } from './patrol.controller';
import { PatrolService } from './patrol.service';

describe('PatrolController', () => {
  let controller: PatrolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrolController],
      providers: [PatrolService],
    }).compile();

    controller = module.get<PatrolController>(PatrolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
