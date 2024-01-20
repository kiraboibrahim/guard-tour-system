import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';
import { CompanyAdmin } from '../entities/company-admin.entity';
import { UserService } from './user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { COMPANY_ADMIN_PAGINATION_CONFIG } from '../pagination-config/company-admin-pagination.config';
import { BaseService } from '../../core/core.base';
import { PermissionsService } from '../../permissions/permissions.service';
import { Resource } from '../../permissions/permissions';

@Injectable()
export class CompanyAdminService extends BaseService {
  constructor(
    @InjectRepository(CompanyAdmin)
    private companyAdminRepository: Repository<CompanyAdmin>,
    private userService: UserService,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createCompanyAdminDto: CreateCompanyAdminDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.COMPANY_ADMIN, createCompanyAdminDto, {
        throwError: true,
      });
    return await this.userService.createCompanyAdmin(createCompanyAdminDto);
  }

  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.COMPANY_ADMIN)
      .with(query);
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
    await this.permissionsService
      .can(this.user)
      .update(Resource.COMPANY_ADMIN, id, updateCompanyAdminDto, {
        throwError: true,
      });
    return await this.userService.updateCompanyAdmin(id, updateCompanyAdminDto);
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
}
