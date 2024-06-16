import { Test, TestingModule } from '@nestjs/testing';
import { SiteAdminController } from './site-admin.controller';

describe('SiteAdminController', () => {
  let controller: SiteAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteAdminController],
    }).compile();

    controller = module.get<SiteAdminController>(SiteAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
