import { Injectable } from '@nestjs/common';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';

@Injectable()
export class SecurityGuardService {
  create(createSecurityGuardDto: CreateSecurityGuardDto) {
    return 'This action adds a security guard';
  }

  findAll() {
    return `This action returns all security guards`;
  }

  findOneById(id: number) {
    return `This action returns a #${id} security guard`;
  }

  findOneByUsername(username: string) {}

  update(id: number, updateSecurityGuardDto: UpdateSecurityGuardDto) {
    return `This action updates a #${id} security guard`;
  }

  remove(id: number) {
    return `This action removes a #${id} security guard`;
  }
}
