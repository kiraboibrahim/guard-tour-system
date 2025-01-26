import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { SuperAdmin } from './entities/super-admin.entity';
import { UserService } from '@user/user.service';
import { BaseService } from '@core/base/base.service';
import { PermissionsService } from '@permissions/permissions.service';

import { Resource } from '@core/core.constants';

@Injectable()
export class SuperAdminService extends BaseService {
  constructor(
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    private userService: UserService,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createSuperAdminDto: CreateSuperAdminDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SUPER_ADMIN, createSuperAdminDto, {
        throwError: true,
      });
    //return await this.userService.createSuperAdmin(createSuperAdminDto);
  }

  async find() {
    return await this.superAdminRepository.find();
  }

  async findOneById(id: number) {
    return await this.superAdminRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.SUPER_ADMIN, id, updateSuperAdminDto, {
        throwError: true,
      });
    return await this.userService.updateSuperAdmin(id, updateSuperAdminDto);
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
}
