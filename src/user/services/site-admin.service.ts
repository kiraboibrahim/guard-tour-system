import { Injectable } from '@nestjs/common';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';

@Injectable()
export class SiteAdminService {
  create(createSiteAdminDto: CreateSiteAdminDto) {
    return 'This action adds a site admin';
  }

  findAll() {
    return `This action returns all site admins`;
  }

  findOneById(id: number) {
    return `This action returns a #${id} site admin`;
  }

  findOneByUsername(username: string) {}

  update(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    return `This action updates a #${id} site admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} site admin`;
  }
}
