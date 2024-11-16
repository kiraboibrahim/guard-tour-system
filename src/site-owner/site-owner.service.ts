import { Injectable } from '@nestjs/common';
import { CreateSiteOwnerDto } from './dto/create-site-owner.dto';
import { UpdateSiteOwnerDto } from './dto/update-site-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteOwner } from './entities/site-owner.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SITE_OWNER_PAGINATION_CONFIG } from './site-owner.pagination';
import { BaseService } from '../core/base/base.service';
import { PermissionsService } from '../permissions/permissions.service';

import { Resource } from '@core/core.constants';

@Injectable()
export class SiteOwnerService extends BaseService {
  constructor(
    private userService: UserService,
    @InjectRepository(SiteOwner)
    private siteOwnerRepository: Repository<SiteOwner>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createSiteOwnerDto: CreateSiteOwnerDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SITE_OWNER, createSiteOwnerDto, { throwError: true });
    return await this.userService.createSiteOwner(createSiteOwnerDto);
  }

  async findAll(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.SITE_OWNER)
      .with(query);
    this.applyFilters(query);
    return await paginate(
      query,
      this.siteOwnerRepository,
      SITE_OWNER_PAGINATION_CONFIG,
    );
  }

  async findOne(id: number) {
    return await this.siteOwnerRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSiteOwnerDto: UpdateSiteOwnerDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.SITE_OWNER, id, updateSiteOwnerDto, {
        throwError: true,
      });
    return await this.userService.updateSiteOwner(id, updateSiteOwnerDto);
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
}
