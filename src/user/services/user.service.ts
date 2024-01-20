import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser, User } from '../entities/user.base.entity';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { CompanyAdmin } from '../entities/company-admin.entity';
import { SiteAdmin } from '../entities/site-admin.entity';
import { SecurityGuard } from '../entities/security-guard.entity';
import { Role } from '../../roles/roles';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { isEmptyObjet, removeEmptyObjects } from '../../core/core.utils';
import { SuperAdmin } from '../entities/super-admin.entity';
import { CreateSuperAdminDto } from '../dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../dto/update-super-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AuthUser)
    private authUserRepository: Repository<AuthUser>,
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
    return await this.authUserRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    const user = await this.authUserRepository.findOneBy({
      username,
    });
    if (user === null) return null;
    const whereOptions = { userId: user.id };
    switch (user.role) {
      case Role.SUPER_ADMIN:
        return await this.superAdminRepository.findOneBy(whereOptions);
      case Role.COMPANY_ADMIN:
        return await this.companyAdminRepository.findOneBy(whereOptions);
      case Role.SITE_ADMIN:
        return await this.siteAdminRepository.findOneBy(whereOptions);
      default:
        return null;
    }
  }
  async updateSuperAdmin(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return await this.updateUser(id, updateSuperAdminDto, Role.SUPER_ADMIN);
  }
  async updateCompanyAdmin(
    id: number,
    updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    return await this.updateUser(id, updateCompanyAdminDto, Role.COMPANY_ADMIN);
  }
  async updateSiteAdmin(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    return await this.updateUser(id, updateSiteAdminDto, Role.SITE_ADMIN);
  }

  async updateSecurityGuard(
    id: number,
    updateSecurityGuardDto: UpdateSecurityGuardDto,
  ) {
    return await this.updateUser(
      id,
      updateSecurityGuardDto,
      Role.SECURITY_GUARD,
    );
  }
  private async updateUser(id: number, updateUserDto: any, role: Role) {
    let updateResult = null;
    const userLikeEntity = this.dtoToUserLikeEntity(updateUserDto, role);
    const { user: commonUserData, ...userSpecificData } = userLikeEntity;
    const commonUserDataExists = !isEmptyObjet(commonUserData);
    const userSpecificDataExists = !isEmptyObjet(userSpecificData);
    if (commonUserDataExists && role != Role.SECURITY_GUARD) {
      await this.authUserRepository.update({ id }, commonUserData);
    } else if (commonUserDataExists && role == Role.SECURITY_GUARD) {
      await this.userRepository.update({ id }, commonUserData);
    }

    switch (role) {
      case Role.SUPER_ADMIN:
        if (userSpecificDataExists) {
          updateResult = await this.superAdminRepository.update(
            { userId: id },
            userSpecificData,
          );
        }
        break;
      case Role.COMPANY_ADMIN:
        if (userSpecificDataExists)
          updateResult = await this.companyAdminRepository.update(
            { userId: id },
            userSpecificData,
          );
        break;
      case Role.SITE_ADMIN:
        if (userSpecificDataExists)
          updateResult = await this.siteAdminRepository.update(
            { userId: id },
            userSpecificData,
          );
        break;
      case Role.SECURITY_GUARD:
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
    let deleteResult = await this.authUserRepository.delete(id);
    const { affected } = deleteResult;
    const nothingDeleted = affected === 0;
    if (nothingDeleted) {
      deleteResult = await this.userRepository.delete(id);
    }
    return deleteResult;
  }

  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) {
    return await this.createUser(createSuperAdminDto, Role.SUPER_ADMIN);
  }

  async createCompanyAdmin(createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.createUser(createCompanyAdminDto, Role.COMPANY_ADMIN);
  }

  async createSiteAdmin(createSiteAdminDto: CreateSiteAdminDto) {
    return await this.createUser(createSiteAdminDto, Role.SITE_ADMIN);
  }

  async createSecurityGuard(createSecurityGuardDto: CreateSecurityGuardDto) {
    return await this.createUser(createSecurityGuardDto, Role.SECURITY_GUARD);
  }

  private async createUser(createUserDto: any, role: Role) {
    const userLikeEntity = this.dtoToUserLikeEntity(createUserDto, role);
    switch (role) {
      case Role.SUPER_ADMIN:
        const superAdmin = this.superAdminRepository.create(userLikeEntity);
        return await this.superAdminRepository.save(superAdmin);
      case Role.COMPANY_ADMIN:
        // Signals work with Entity objects(instantiated thru constructors) and not from literal objects- {}
        const companyAdmin = this.companyAdminRepository.create(userLikeEntity);
        return await this.companyAdminRepository.save(companyAdmin);
      case Role.SITE_ADMIN:
        const siteAdmin = this.siteAdminRepository.create(userLikeEntity);
        return await this.siteAdminRepository.save(siteAdmin);
      case Role.SECURITY_GUARD:
        const securityGuard =
          this.securityGuardRepository.create(userLikeEntity);
        return await this.securityGuardRepository.save(securityGuard);
      default:
        throw new NotFoundException('Role not found');
    }
  }
  private dtoToUserLikeEntity(dto: any, role: Role) {
    const convert = (obj: any) => {
      const { firstName, lastName, phoneNumber, ...userSpecificData } = obj;
      const user = {
        ...userSpecificData,
        user: {
          firstName,
          lastName,
          phoneNumber,
          role,
        },
      };
      if (role !== Role.SECURITY_GUARD) {
        // We ar dealing with a dto of an AuthUser
        // userSpecificData is data that doesn't belong to the base user entity
        const { email, password } = userSpecificData;
        user.user = { ...user.user, password, username: email };
        return user;
      }
      return user;
    };
    return removeEmptyObjects(convert(dto));
  }
}
