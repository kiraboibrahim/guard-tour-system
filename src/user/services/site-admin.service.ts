import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { SiteAdmin } from '../entities/site-admin.entity';
import { UserService } from './user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SITE_ADMIN_PAGINATION_CONFIG } from '../pagination-config/site-admin-pagination.config';
import { BaseService } from '../../core/core.base';
import { PermissionsService } from '../../permissions/permissions.service';
import { Resource } from '../../permissions/permissions';

@Injectable()
export class SiteAdminService extends BaseService {
  constructor(
    @InjectRepository(SiteAdmin)
    private siteAdminRepository: Repository<SiteAdmin>,
    private userService: UserService,
    private permissionsService: PermissionsService,
  ) {
    super();
  }

  async create(createSiteAdminDto: CreateSiteAdminDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SITE_ADMIN, createSiteAdminDto, { throwError: true });
    return await this.userService.createSiteAdmin(createSiteAdminDto);
  }

  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.SITE_ADMIN)
      .with(query);
    this.filterOnUserCompany(query);
    return await paginate(
      query,
      this.siteAdminRepository,
      SITE_ADMIN_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.siteAdminRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.SITE_ADMIN, id, updateSiteAdminDto, {
        throwError: true,
      });
    return await this.userService.updateSiteAdmin(id, updateSiteAdminDto);
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
}
