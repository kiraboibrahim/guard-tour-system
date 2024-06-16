import { Test, TestingModule } from '@nestjs/testing';
import { SiteAdminService } from './site-admin.service';

describe('SiteAdminService', () => {
  let service: SiteAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteAdminService],
    }).compile();

    service = module.get<SiteAdminService>(SiteAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
