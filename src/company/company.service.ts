import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { COMPANY_PAGINATION_CONFIG } from './company-pagination.config';
import { BaseService } from '../core/core.base';
import { PermissionsService } from '../permissions/permissions.service';
import { Resource } from '../permissions/permissions';

@Injectable()
export class CompanyService extends BaseService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private permissionsService: PermissionsService,
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
    return await this.companyRepository.findOneBy({ id });
  }
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.COMPANY, id, updateCompanyDto, { throwError: true });
    return await this.companyRepository.update({ id }, updateCompanyDto);
  }

  async remove(id: number) {
    return await this.companyRepository.delete(id);
  }
}
