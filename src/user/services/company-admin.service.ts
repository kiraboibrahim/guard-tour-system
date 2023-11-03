import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';
import { CompanyAdmin } from '../entities/company-admin.entity';
import { UserService } from './user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { COMPANY_ADMIN_PAGINATION_CONFIG } from '../pagination-config/company-admin-pagination.config';

@Injectable()
export class CompanyAdminService {
  constructor(
    @InjectRepository(CompanyAdmin)
    private companyAdminRepository: Repository<CompanyAdmin>,
    private userService: UserService,
  ) {}
  async create(createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.userService.createCompanyAdmin(createCompanyAdminDto);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.companyAdminRepository,
      COMPANY_ADMIN_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.companyAdminRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateCompanyAdminDto: UpdateCompanyAdminDto) {
    return await this.userService.updateCompanyAdmin(id, updateCompanyAdminDto);
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
}
