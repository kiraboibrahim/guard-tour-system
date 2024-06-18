import { Test, TestingModule } from '@nestjs/testing';
import { SiteOwnerService } from './site-owner.service';

describe('SiteOwnerService', () => {
  let service: SiteOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteOwnerService],
    }).compile();

    service = module.get<SiteOwnerService>(SiteOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
