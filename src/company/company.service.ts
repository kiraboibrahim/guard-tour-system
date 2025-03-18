import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { COMPANY_PAGINATION_CONFIG } from './company.pagination';
import { BaseService } from '@core/base/base.service';
import { PermissionsService } from '@permissions/permissions.service';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';
import { SiteAdmin } from '@site-admin/entities/site-admin.entity';
import { CompanyAdmin } from '@company-admin/entities/company-admin.entity';
import { Site } from '@site/entities/site.entity';
import { Patrol } from '@patrol/entities/patrol.entity';
import { Tag } from '@tag/entities/tag.entity';
import { Resource } from '@core/core.constants';
import { StorageService } from '../storage/storage.service';
import CreateThemeDto from '@company/dto/create-theme.dto';
import { Theme } from '@company/entities/theme.entity';
import UpdateThemeDto from '@company/dto/update-theme.dto';

@Injectable()
export class CompanyService extends BaseService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private permissionsService: PermissionsService,
    @InjectEntityManager() private entityManager: EntityManager,
    private storageService: StorageService,
  ) {
    super();
  }
  async create(createCompanyDto: CreateCompanyDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.COMPANY, createCompanyDto, { throwError: true });
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.COMPANY)
      .with(query);
    return await paginate(
      query,
      this.companyRepository,
      COMPANY_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) return;
    const companyStats = await this.getCompanyStats(id);
    return {
      ...company,
      stats: companyStats,
    };
  }
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.COMPANY, id, updateCompanyDto, { throwError: true });
    return await this.companyRepository.update({ id }, updateCompanyDto);
  }

  async uploadCompanyLogo(companyId: number, logo: Express.Multer.File) {
    const [logoUrl] = await this.storageService.upload(
      [logo],
      Resource.COMPANY,
      companyId,
    );
    return await Company.update({ id: companyId }, { logo: logoUrl });
  }

  async remove(id: number) {
    return await this.companyRepository.delete(id);
  }

  async getCompanyStats(companyId: number) {
    const companyAdminCount = await this.entityManager
      .getRepository(CompanyAdmin)
      .countBy({ companyId });
    const siteAdminCount = await this.entityManager
      .getRepository(SiteAdmin)
      .countBy({ companyId });
    const securityGuardCount = await this.entityManager
      .getRepository(SecurityGuard)
      .countBy({ companyId });

    const siteCount = await this.entityManager
      .getRepository(Site)
      .countBy({ companyId });
    const tagCount = await this.entityManager
      .getRepository(Tag)
      .countBy({ companyId });
    const patrolCount = await this.entityManager.getRepository(Patrol).count({
      relations: { site: true },
      where: { site: { companyId } },
    });

    return {
      companyAdminCount,
      siteAdminCount,
      securityGuardCount,
      siteCount,
      tagCount,
      patrolCount,
    };
  }

  async createTheme(createThemeDto: CreateThemeDto) {
    const { companyId } = this.user;
    return await Theme.createTheme(companyId, createThemeDto);
  }

  async updateTheme(updateThemeDto: UpdateThemeDto) {
    const { companyId } = this.user;
    return await Theme.updateTheme(companyId, updateThemeDto);
  }

  async deleteLogo(companyId: number) {
    return await Company.update({ id: companyId }, { logo: null });
  }

  async deleteTheme() {
    const { companyId } = this.user;
    return await Theme.deleteTheme(companyId);
  }
}
