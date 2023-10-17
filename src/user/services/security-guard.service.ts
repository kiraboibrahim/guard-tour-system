import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { SecurityGuard } from '../entities/security-guard.entity';
import { PermissionsService } from '../../permissions/permissions.service';
import { UserService } from './user.service';

@Injectable()
export class SecurityGuardService {
  constructor(
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    private userService: UserService,
    private permissionsService: PermissionsService,
  ) {}

  async create(createSecurityGuardDto: CreateSecurityGuardDto) {
    // TODO: CompanyId of companyAdmin should be === to companyId in DTO otherwise, throw Unauthorized exception
    return this.userService.createSecurityGuard(createSecurityGuardDto);
  }

  async findAll() {
    return await this.securityGuardRepository.find();
  }

  async findOneById(id: number) {
    return await this.securityGuardRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSecurityGuardDto: UpdateSecurityGuardDto) {
    // TODO: Authorize updates to the company(Only SuperAdmins update company 2 which security guard belongs)
    await this.userService.updateSecurityGuard(id, updateSecurityGuardDto);
  }

  async remove(id: number) {
    await this.securityGuardRepository.delete(id);
  }
}
