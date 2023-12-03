import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSuperAdminDto } from '../dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../dto/update-super-admin.dto';
import { SuperAdmin } from '../entities/super-admin.entity';
import { UserService } from './user.service';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    private userService: UserService,
  ) {}
  create(createSuperAdminDto: CreateSuperAdminDto) {
    return this.userService.createSuperAdmin(createSuperAdminDto);
  }

  async findAll() {
    return await this.superAdminRepository.find();
  }

  async findOneById(id: number) {
    return await this.superAdminRepository.findOneBy({ userId: id });
  }

  update(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return this.userService.updateSuperAdmin(id, updateSuperAdminDto);
  }

  remove(id: number) {
    return this.userService.remove(id);
  }
}
