import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { SiteAdmin } from '../entities/site-admin.entity';
import { UserService } from './user.service';

@Injectable()
export class SiteAdminService {
  constructor(
    @InjectRepository(SiteAdmin)
    private siteAdminRepository: Repository<SiteAdmin>,
    private userService: UserService,
  ) {}
  async create(createSiteAdminDto: CreateSiteAdminDto) {
    return await this.userService.createSiteAdmin(createSiteAdminDto);
  }

  async findAll() {
    return await this.siteAdminRepository.find();
  }

  async findOneById(id: number) {
    return await this.siteAdminRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    return await this.userService.updateSiteAdmin(id, updateSiteAdminDto);
  }

  async remove(id: number) {
    return await this.siteAdminRepository.delete({ userId: id });
  }
}
