import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  SUPER_ADMIN_ROLE,
} from '../../roles/roles.constants';
import { Role } from '../../roles/roles.types';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { isEmptyObjet, removeEmpty } from '../../core/core.utils';
import { SuperAdmin } from '../entities/super-admin.entity';
import { CreateSuperAdminDto } from '../dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../dto/update-super-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(CompanyAdmin)
    private companyAdminRepository: Repository<CompanyAdmin>,
    @InjectRepository(SiteAdmin)
    private siteAdminRepository: Repository<SiteAdmin>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
  ) {}

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOneBy({
      username: username,
    });
    if (user === null) return null;
    const whereOptions = { userId: user.id };
    switch (user.role) {
      case SUPER_ADMIN_ROLE:
        return await this.superAdminRepository.findOneBy(whereOptions);
      case COMPANY_ADMIN_ROLE:
        return await this.companyAdminRepository.findOneBy(whereOptions);
      case SITE_ADMIN_ROLE:
        return await this.siteAdminRepository.findOneBy(whereOptions);
      case SECURITY_GUARD_ROLE:
        return await this.securityGuardRepository.findOneBy(whereOptions);
      default:
        return null;
    }
  }
  async updateSuperAdmin(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return await this.updateUser(id, updateSuperAdminDto, SUPER_ADMIN_ROLE);
  }
  async updateCompanyAdmin(
    id: number,
    updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    return await this.updateUser(id, updateCompanyAdminDto, COMPANY_ADMIN_ROLE);
  }
  async updateSiteAdmin(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    return await this.updateUser(id, updateSiteAdminDto, SITE_ADMIN_ROLE);
  }

  async updateSecurityGuard(
    id: number,
    updateSecurityGuardDto: UpdateSecurityGuardDto,
  ) {
    return await this.updateUser(
      id,
      updateSecurityGuardDto,
      SECURITY_GUARD_ROLE,
    );
  }
  private async updateUser(id: number, updateUserDto: any, role: Role) {
    let updateResult = null;
    const userLikeEntity = this.dtoToUserLikeEntity(updateUserDto, role);
    const { user: commonUserData, ...userSpecificData } = userLikeEntity;
    const commonUserDataExists = !isEmptyObjet(commonUserData);
    const userSpecificDataExists = !isEmptyObjet(userSpecificData);
    if (commonUserDataExists)
      await this.userRepository.update({ id }, commonUserData);
    switch (role) {
      case SUPER_ADMIN_ROLE:
        if (userSpecificDataExists) {
          updateResult = await this.superAdminRepository.update(
            { userId: id },
            userSpecificData,
          );
        }
        break;
      case COMPANY_ADMIN_ROLE:
        if (userSpecificDataExists)
          updateResult = await this.companyAdminRepository.update(
            { userId: id },
            userSpecificData,
          );
        break;
      case SITE_ADMIN_ROLE:
        if (userSpecificDataExists)
          updateResult = await this.siteAdminRepository.update(
            { userId: id },
            userSpecificData,
          );
        break;
      case SECURITY_GUARD_ROLE:
        if (userSpecificDataExists)
          updateResult = await this.securityGuardRepository.update(
            { userId: id },
            userSpecificData,
          );
        break;
      default:
        throw new NotFoundException('Role not found');
    }
    return updateResult;
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) {
    return await this.createUser(createSuperAdminDto, SUPER_ADMIN_ROLE);
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
      case SUPER_ADMIN_ROLE:
        const superAdmin = this.superAdminRepository.create(userLikeEntity);
        return await this.superAdminRepository.save(superAdmin);
      case COMPANY_ADMIN_ROLE:
        // Signals work with Entity objects(instantiated thru constructors) and not from {}
        const companyAdmin = this.companyAdminRepository.create(userLikeEntity);
        return await this.companyAdminRepository.save(companyAdmin);
      case SITE_ADMIN_ROLE:
        const siteAdmin = this.siteAdminRepository.create(userLikeEntity);
        return await this.siteAdminRepository.save(siteAdmin);
      case SECURITY_GUARD_ROLE:
        const securityGuard =
          this.securityGuardRepository.create(userLikeEntity);
        return await this.securityGuardRepository.save(securityGuard);
      default:
        throw new NotFoundException('Role not found');
    }
  }
  private dtoToUserLikeEntity(dto: any, role: Role) {
    const convert = (obj: any) => {
      const {
        firstName,
        lastName,
        phoneNumber,
        password,
        ...userSpecificData
      } = obj;
      // userSpecificData is data that doesn't belong to the base user entity
      const { email, uniqueId } = userSpecificData;
      return {
        ...userSpecificData,
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
  async userBelongsToCompany(userId: number, companyId: number, role: Role) {
    switch (role) {
      case SUPER_ADMIN_ROLE:
        return false;
      case COMPANY_ADMIN_ROLE:
        return !!(await this.companyAdminRepository.findOneBy({
          userId,
          companyId,
        }));
      case SITE_ADMIN_ROLE:
        return !!(await this.siteAdminRepository.findOneBy({
          userId,
          companyId,
        }));
      case SECURITY_GUARD_ROLE:
        return !!(await this.securityGuardRepository.findOneBy({
          userId,
          companyId,
        }));
      default:
        return false;
    }
  }
}
