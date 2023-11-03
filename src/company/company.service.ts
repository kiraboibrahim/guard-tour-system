import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { Site } from '../site/entities/site.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { COMPANY_PAGINATION_CONFIG } from './company-pagination.config';
import { SITE_PAGINATION_CONFIG } from '../site/site-pagination.config';
import { SECURITY_GUARD_PAGINATION_CONFIG } from '../user/pagination-config/security-guard-pagination.config';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    private permissionsService: PermissionsService,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.companyRepository,
      COMPANY_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.companyRepository.findOneBy({ id });
  }
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update({ id }, updateCompanyDto);
  }

  async remove(id: number) {
    await this.companyRepository.delete(id);
  }

  async findAllCompanySites(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, companyId: [`${id}`] };
    return await paginate(query, this.siteRepository, SITE_PAGINATION_CONFIG);
  }

  async findAllCompanySecurityGuards(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, companyId: [`${id}`] };
    return await paginate(
      query,
      this.securityGuardRepository,
      SECURITY_GUARD_PAGINATION_CONFIG,
    );
  }
}
