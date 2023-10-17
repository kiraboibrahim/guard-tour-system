import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.base.entity';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { CompanyAdmin } from '../entities/company-admin.entity';
import { SiteAdmin } from '../entities/site-admin.entity';
import { SecurityGuard } from '../entities/security-guard.entity';
import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SITE_ADMIN_ROLE,
} from '../../roles/roles.constants';
import { Role } from '../../roles/roles.types';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { isEmptyObjet, removeEmpty } from '../../core/core.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CompanyAdmin)
    private companyAdminRepository: Repository<CompanyAdmin>,
    @InjectRepository(SiteAdmin)
    private siteAdminRepository: Repository<SiteAdmin>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({
      username: username,
    });
  }

  async updateCompanyAdmin(
    id: number,
    updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    await this.updateUser(id, updateCompanyAdminDto, COMPANY_ADMIN_ROLE);
  }
  async updateSiteAdmin(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    await this.updateUser(id, updateSiteAdminDto, SITE_ADMIN_ROLE);
  }

  async updateSecurityGuard(
    id: number,
    updateSecurityGuardDto: UpdateSecurityGuardDto,
  ) {
    await this.updateUser(id, updateSecurityGuardDto, SECURITY_GUARD_ROLE);
  }
  private async updateUser(id: number, updateUserDto: any, role: Role) {
    let updateResult = null;
    const userLikeEntity = this.dtoToUserLikeEntity(updateUserDto, role);
    const { user, ...otherEntityData } = userLikeEntity;
    const userDataExists = !isEmptyObjet(user);
    const otherEntityDataExists = !isEmptyObjet(otherEntityData);
    if (userDataExists) await this.userRepository.update({ id }, user);
    switch (role) {
      case COMPANY_ADMIN_ROLE:
        if (otherEntityDataExists)
          updateResult = await this.companyAdminRepository.update(
            { userId: id },
            otherEntityData,
          );
        break;
      case SITE_ADMIN_ROLE:
        if (otherEntityDataExists)
          updateResult = await this.siteAdminRepository.update(
            { userId: id },
            otherEntityData,
          );
        break;
      case SECURITY_GUARD_ROLE:
        if (otherEntityDataExists)
          updateResult = await this.securityGuardRepository.update(
            { userId: id },
            otherEntityData,
          );
        break;
      default:
        throw new NotFoundException('Role not found');
    }
    return updateResult;
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  async createCompanyAdmin(createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.createUser(createCompanyAdminDto, COMPANY_ADMIN_ROLE);
  }

  async createSiteAdmin(createSiteAdminDto: CreateSiteAdminDto) {
    return await this.createUser(createSiteAdminDto, SITE_ADMIN_ROLE);
  }

  async createSecurityGuard(createSecurityGuardDto: CreateSecurityGuardDto) {
    return await this.createUser(createSecurityGuardDto, SECURITY_GUARD_ROLE);
  }

  private async createUser(createUserDto: any, role: Role) {
    const userLikeEntity = this.dtoToUserLikeEntity(createUserDto, role);
    switch (role) {
      case COMPANY_ADMIN_ROLE:
        return await this.companyAdminRepository.save(userLikeEntity);
      case SITE_ADMIN_ROLE:
        return await this.siteAdminRepository.save(userLikeEntity);
      case SECURITY_GUARD_ROLE:
        return await this.securityGuardRepository.save(userLikeEntity);
      default:
        throw new NotFoundException('Role not found');
    }
  }
  private dtoToUserLikeEntity(dto: any, role: Role) {
    const convert = (obj: any) => {
      const { firstName, lastName, phoneNumber, password, ...otherData } = obj;
      // otherData is any other entity specific data
      const { email, uniqueId } = otherData;
      return {
        ...otherData,
        user: {
          firstName,
          lastName,
          phoneNumber,
          password,
          username: email || uniqueId,
          role,
        },
      };
    };
    return removeEmpty(convert(dto));
  }
}
