import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { Patrol } from '@patrol/entities/patrol.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PATROL_PAGINATION_CONFIG } from '@patrol/patrol.pagination';
import { SITE_PAGINATION_CONFIG } from './pagination/site.pagination';
import { BaseService } from '@core/base/base.service';
import { PermissionsService } from '@permissions/permissions.service';
import { DelayedPatrolNotification } from './entities/delayed-patrol-notification.entity';
import { DELAYED_PATROL_NOTIFICATION_PAGINATION_CONFIG } from './pagination/delayed-patrol-notification.pagination';
import { SiteOwner } from '../site-owner/entities/site-owner.entity';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';
import { SECURITY_GUARD_TYPE } from '@security-guard/security-guard.constants';
import { Resource } from '@core/core.constants';
import { Shift } from '@shift/entities/shift.entity';
import { CallLog } from '../call-center/entities/call-log.entity';
import { SITE_CALL_LOGS_PAGINATION_CONFIG } from '../call-center/call-center.pagination';
import { LocalDate, LocalTime } from '@js-joda/core';

@Injectable()
export class SiteService extends BaseService {
  constructor(
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
    @InjectRepository(DelayedPatrolNotification)
    private patrolDelayNotificationRepository: Repository<DelayedPatrolNotification>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    @InjectRepository(CallLog) private callLogRepository: Repository<CallLog>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createSiteDto: CreateSiteDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SITE, createSiteDto, { throwError: true });

    const { siteOwner }: { siteOwner: SiteOwner } = createSiteDto as any;
    const site = this.siteRepository.create({
      ...createSiteDto,
      owner: siteOwner,
    });
    return await this.siteRepository.save(site);
  }

  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.SITE)
      .with(query);
    this.applyFilters(query);
    return await paginate(query, this.siteRepository, SITE_PAGINATION_CONFIG);
  }

  async findOneById(id: string) {
    const relations = {
      tags: true,
      latestPatrol: { securityGuard: { user: true } },
    };
    let site = null;
    const MAX_ID = Math.pow(2, 31) - 1;
    const isSafeID = +id <= MAX_ID;
    // Postgres serial id can only support upto MAX_ID. Any further ID comparisons
    // with ids bigger than that raises a QueryFailedError. TagIds are really so big
    if (isSafeID) {
      site = await Site.findOne({
        where: [{ id: +id }, { tagId: id }],
        relations,
      });
    } else {
      site = await Site.findOne({ where: { tagId: id }, relations });
    }
    if (!site) return;

    const supervisors = await this.securityGuardRepository.findBy({
      type: SECURITY_GUARD_TYPE.SUPERVISOR,
      companyId: site.companyId,
    });
    const securityGuardCount = await this.securityGuardRepository.countBy({
      shift: { site: { id: site.id } },
    });
    const latestSitePatrol = await site.findLatestPatrol();
    return { ...site, supervisors, latestSitePatrol, securityGuardCount };
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.SITE, id, updateSiteDto, { throwError: true });

    const { siteOwner }: { siteOwner: SiteOwner } = updateSiteDto as any;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ownerId, ...newSiteData } = updateSiteDto;
    return await this.siteRepository.update(
      { id },
      { ...newSiteData, owner: ownerId === null ? null : siteOwner },
    );
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

  async findSiteShifts(siteId: number) {
    return await Shift.findBy({ site: { id: siteId } });
  }
  async findSiteCallLogs(siteId: number, query: PaginateQuery) {
    return await paginate(
      query,
      this.callLogRepository,
      SITE_CALL_LOGS_PAGINATION_CONFIG(siteId),
    );
  }
  async findSiteNotifications(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    await this.permissionsService
      .can(this.user)
      .filter(Resource.NOTIFICATION)
      .with(query);
    return await paginate(
      query,
      this.patrolDelayNotificationRepository,
      DELAYED_PATROL_NOTIFICATION_PAGINATION_CONFIG,
    );
  }
  async getSiteDailyScore(
    siteId: number,
    year: number,
    month: number,
    day: number,
  ) {
    return await Site.getDailyScore(siteId, year, month, day);
  }

  async getSiteMonthlyScore(siteId: number, year: number, month: number) {
    return await Site.getMonthlyScore(siteId, year, month);
  }
}
