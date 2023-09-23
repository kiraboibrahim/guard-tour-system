import { Injectable } from '@nestjs/common';
import { CreateSuperAdminDto } from '../dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../dto/update-super-admin.dto';

@Injectable()
export class SuperAdminService {
  create(createSuperAdminDto: CreateSuperAdminDto) {
    return 'This action adds a super admin';
  }

  findAll() {
    return `This action returns all super admins`;
  }

  findOneById(id: number) {
    return `This action returns a #${id} super admin`;
  }

  findOneByUsername(username: string) {}

  update(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return `This action updates a #${id} super admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} super admin`;
  }
}
