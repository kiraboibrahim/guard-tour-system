import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { Shift } from '../shift/entities/shift.entity';
import { Device } from '../device/entities/device.entity';
import { Patrol } from '../patrol/entities/patrol.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SHIFT_PAGINATION_CONFIG } from '../shift/shift-pagination.config';
import { DEVICE_PAGINATION_CONFIG } from '../device/device-pagination.config';
import { PATROL_PAGINATION_CONFIG } from '../patrol/patrol-pagination.config';
import { SITE_PAGINATION_CONFIG } from './site-pagination.config';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {}
  async create(createSiteDto: CreateSiteDto) {
    const site = this.siteRepository.create(createSiteDto);
    return await this.siteRepository.save(site);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.siteRepository, SITE_PAGINATION_CONFIG);
  }

  async findOneById(id: number) {
    return await this.siteRepository.findOneBy({ id });
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    return await this.siteRepository.update({ id }, updateSiteDto);
  }

  async remove(id: number) {
    return await this.siteRepository.delete(id);
  }
  async findAllSiteShifts(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    return await paginate(query, this.shiftRepository, SHIFT_PAGINATION_CONFIG);
  }

  async findAllSiteDevices(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    return await paginate(
      query,
      this.deviceRepository,
      DEVICE_PAGINATION_CONFIG,
    );
  }

  async findAllSitePatrols(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, siteId: [`${id}`] };
    return await paginate(
      query,
      this.patrolRepository,
      PATROL_PAGINATION_CONFIG,
    );
  }

  async findSiteDevicesCount(id: number) {
    return await this.deviceRepository.countBy({ siteId: id });
  }
}
