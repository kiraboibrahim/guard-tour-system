import { Test, TestingModule } from '@nestjs/testing';
import { SiteOwnerController } from './site-owner.controller';
import { SiteOwnerService } from './site-owner.service';

describe('SiteOwnerController', () => {
  let controller: SiteOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteOwnerController],
      providers: [SiteOwnerService],
    }).compile();

    controller = module.get<SiteOwnerController>(SiteOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
