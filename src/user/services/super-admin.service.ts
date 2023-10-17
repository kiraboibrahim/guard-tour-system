import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSuperAdminDto } from '../dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../dto/update-super-admin.dto';
import { SuperAdmin } from '../entities/super-admin.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
  ) {}
  create(createSuperAdminDto: CreateSuperAdminDto) {
    return 'This action adds a super admin';
  }

  async findAll() {
    return await this.superAdminRepository.find();
  }

  async findOneById(id: number) {
    return await this.superAdminRepository.findOneBy({ userId: id });
  }

  update(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return `This action updates a #${id} super admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} super admin`;
  }
}
