import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site) private siteRepository: Repository<Site>,
  ) {}
  async create(createSiteDto: CreateSiteDto) {
    this.siteRepository.create(createSiteDto);
  }

  async findAll() {
    return await this.siteRepository.find();
  }

  async findOneById(id: number) {
    return await this.siteRepository.findOneBy({ id });
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    await this.siteRepository.update({ id }, updateSiteDto);
  }

  async remove(id: number) {
    await this.siteRepository
      .createQueryBuilder('site')
      .delete()
      .from(Site)
      .where('site.id = :id', { id })
      .execute();
  }
}
