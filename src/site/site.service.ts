import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { Patrol } from '../patrol/entities/patrol.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PATROL_PAGINATION_CONFIG } from '../patrol/patrol-pagination.config';
import { SITE_PAGINATION_CONFIG } from './pagination-configs/site-pagination.config';
import { BaseService } from '../core/core.base';
import { Resource } from '../permissions/permissions';
import { PermissionsService } from '../permissions/permissions.service';
import { PatrolDelayNotification } from './entities/patrol-delay-notification.entity';
import { PATROL_DELAY_NOTIFICATION_PAGINATION_CONFIG } from './pagination-configs/patrol-delay-notification.pagination.config';

@Injectable()
export class SiteService extends BaseService {
  constructor(
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
    @InjectRepository(PatrolDelayNotification)
    private patrolDelayNotificationRepository: Repository<PatrolDelayNotification>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createSiteDto: CreateSiteDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SITE, createSiteDto, { throwError: true });

    const site = this.siteRepository.create(createSiteDto);
    return await this.siteRepository.save(site);
  }

  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.SITE)
      .with(query);
    this.filterOnUserCompany(query);
    return await paginate(query, this.siteRepository, SITE_PAGINATION_CONFIG);
  }

  async findOneById(id: string) {
    return await this.siteRepository.findOne({
      where: [{ id: +id }, { tagId: id }],
      relations: { tags: true },
    });
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.SITE, id, updateSiteDto, { throwError: true });

    return await this.siteRepository.update({ id }, updateSiteDto);
  }

  async remove(id: number) {
    return await this.siteRepository.delete(id);
  }

  async findSitePatrols(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    return await paginate(
      query,
      this.patrolRepository,
      PATROL_PAGINATION_CONFIG,
    );
  }
  async findSiteNotifications(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    // There is no need to check if the user can filter on the siteId because this check has already been done by the permissionService
    return await paginate(
      query,
      this.patrolDelayNotificationRepository,
      PATROL_DELAY_NOTIFICATION_PAGINATION_CONFIG,
    );
  }
}
