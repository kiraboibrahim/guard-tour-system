import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';
import { CompanyAdmin } from '../entities/company-admin.entity';
import { COMPANY_ADMIN_ROLE } from '../../roles/roles.constants';
import { User } from '../entities/user.base.entity';
import { UserService } from './user.service';
import { Company } from '../../company/entities/company.entity';

@Injectable()
export class CompanyAdminService {
  constructor(
    @InjectRepository(CompanyAdmin)
    private companyAdminRepository: Repository<CompanyAdmin>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private userService: UserService,
  ) {}
  async create(createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.userService.createCompanyAdmin(createCompanyAdminDto);
  }

  async findAll() {
    return await this.companyAdminRepository.find();
  }

  async findOneById(id: number) {
    return await this.companyAdminRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateCompanyAdminDto: UpdateCompanyAdminDto) {
    await this.userService.updateCompanyAdmin(id, updateCompanyAdminDto);
  }

  async remove(id: number) {
    await this.companyAdminRepository.delete(id);
  }
}
