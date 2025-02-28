import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '@company/entities/company.entity';
import { Repository } from 'typeorm';
import { CompanyAdmin } from '@company-admin/entities/company-admin.entity';
import { SiteAdmin } from '@site-admin/entities/site-admin.entity';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';
import { Site } from '@site/entities/site.entity';
import { Tag } from '@tag/entities/tag.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(CompanyAdmin)
    private companyAdminRepository: Repository<CompanyAdmin>,
    @InjectRepository(SiteAdmin)
    private siteAdminRepository: Repository<SiteAdmin>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}
  async getStats() {
    const companyCount = await this.companyRepository.count();
    const companyAdminCount = await this.companyAdminRepository.count();
    const siteAdminCount = await this.siteAdminRepository.count();
    const securityGuardCount = await this.securityGuardRepository.count();
    const siteCount = await this.siteRepository.count();
    const tagCount = await this.tagRepository.count();
    return {
      companyCount,
      companyAdminCount,
      siteAdminCount,
      securityGuardCount,
      siteCount,
      tagCount,
    };
  }
}
