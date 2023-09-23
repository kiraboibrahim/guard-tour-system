import { Injectable } from '@nestjs/common';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';

@Injectable()
export class CompanyAdminService {
  create(createCompanyAdminDto: CreateCompanyAdminDto) {
    return 'This action adds a super admin';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOneById(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByUsername(username: string) {}

  update(id: number, updateCompanyAdminDto: UpdateCompanyAdminDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
