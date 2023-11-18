import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { Shift } from '../shift/entities/shift.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Patrol } from '../patrol/entities/patrol.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PATROL_PAGINATION_CONFIG } from '../patrol/patrol-pagination.config';
import { SITE_PAGINATION_CONFIG } from './site-pagination.config';
import { BaseService } from '../core/core.base';

@Injectable()
export class SiteService extends BaseService {
  constructor(
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {
    super();
  }
  async create(createSiteDto: CreateSiteDto) {
    const site = this.siteRepository.create(createSiteDto);
    return await this.siteRepository.save(site);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.siteRepository, SITE_PAGINATION_CONFIG);
  }

  async findOneById(id: number) {
    return await this.siteRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    return await this.siteRepository.update({ id }, updateSiteDto);
  }

  async remove(id: number) {
    return await this.siteRepository.delete(id);
  }

  async findAllSiteShifts(id: number) {
    return await this.shiftRepository.findBy({ siteId: id });
  }

  async findAllSiteTags(id: number) {
    return await this.tagRepository.findBy({ siteId: id });
  }

  async findAllSitePatrols(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    return await paginate(
      query,
      this.patrolRepository,
      PATROL_PAGINATION_CONFIG,
    );
  }

  async siteBelongsToCompany(siteId: number, companyId: number) {
    return !!(await this.siteRepository.findOneBy({ id: siteId, companyId }));
  }
}
