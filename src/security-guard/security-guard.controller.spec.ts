import { Test, TestingModule } from '@nestjs/testing';
import { SecurityGuardController } from './security-guard.controller';

describe('SecurityGuardController', () => {
  let controller: SecurityGuardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityGuardController],
    }).compile();

    controller = module.get<SecurityGuardController>(SecurityGuardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
