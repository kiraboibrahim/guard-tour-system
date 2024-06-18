import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser, User } from './entities/user.base.entity';
import { CreateCompanyAdminDto } from '../company-admin/dto/create-company-admin.dto';
import { CreateSiteAdminDto } from '../site-admin/dto/create-site-admin.dto';
import { CreateSecurityGuardDto } from '../security-guard/dto/create-security-guard.dto';
import { CompanyAdmin } from '../company-admin/entities/company-admin.entity';
import { SiteAdmin } from '../site-admin/entities/site-admin.entity';
import { SecurityGuard } from '../security-guard/entities/security-guard.entity';
import { Role } from '../roles/roles';
import { UpdateCompanyAdminDto } from '../company-admin/dto/update-company-admin.dto';
import { UpdateSiteAdminDto } from '../site-admin/dto/update-site-admin.dto';
import { UpdateSecurityGuardDto } from '../security-guard/dto/update-security-guard.dto';
import { isEmptyObject } from '../core/core.utils';
import { SuperAdmin } from '../super-admin/entities/super-admin.entity';
import { CreateSuperAdminDto } from '../super-admin/dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../super-admin/dto/update-super-admin.dto';
import { CreateSiteOwnerDto } from '../site-owner/dto/create-site-owner.dto';
import { SiteOwner } from '../site-owner/entities/site-owner.entity';
import { UpdateSiteOwnerDto } from '../site-owner/dto/update-site-owner.dto';

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
    @InjectRepository(SiteOwner)
    private siteOwnerRepository: Repository<SiteOwner>,
  ) {}
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

  async createSiteOwner(createSiteOwnerDto: CreateSiteOwnerDto) {
    return await this.createUser(createSiteOwnerDto, Role.SITE_OWNER);
  }

  private async createUser(
    createUserDto: any,
    role: Role,
  ): Promise<SuperAdmin | CompanyAdmin | SiteAdmin | SecurityGuard> {
    /* Password hashing is based on a signal and signals are only executed for
    entity objects(instantiated thru constructors) and not from literal objects -- {}.
    The dtoToUserEntity() function creates entities thru their respective constructors so
    that signals will be executed */
    const userEntity: any = this.dtoToUserEntity(createUserDto, role);
    switch (role) {
      case Role.SUPER_ADMIN:
        return await this.superAdminRepository.save(userEntity);
      case Role.COMPANY_ADMIN:
        return await this.companyAdminRepository.save(userEntity);
      case Role.SITE_ADMIN:
        return await this.siteAdminRepository.save(userEntity);
      case Role.SECURITY_GUARD:
        return await this.securityGuardRepository.save(userEntity);
      case Role.SITE_OWNER:
        return await this.siteOwnerRepository.save(userEntity);
      default:
        throw new BadRequestException('Invalid Role');
    }
  }
  async findOneById(id: number) {
    return await this.authUserRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    const user = await this.authUserRepository.findOneBy({
      [AuthUser.USERNAME_FIELD]: username,
    });
    const whereOptions = { userId: user?.id };
    switch (user?.role) {
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

  async updateSiteOwner(id: number, updateSiteOwnerDto: UpdateSiteOwnerDto) {
    return await this.updateUser(id, updateSiteOwnerDto, Role.SITE_OWNER);
  }

  private async updateUser(id: number, updateUserDto: any, role: Role) {
    const userEntity = this.dtoToUserEntity(updateUserDto, role);
    const { user: baseUser, ...derivedUser } = userEntity;

    if (!isEmptyObject(baseUser) && baseUser instanceof AuthUser) {
      await this.authUserRepository.update({ id }, baseUser);
    } else if (!isEmptyObject(baseUser) && baseUser instanceof User) {
      await this.userRepository.update({ id }, baseUser);
    }

    if (isEmptyObject(derivedUser)) return;

    switch (role) {
      case Role.SUPER_ADMIN:
        return await this.superAdminRepository.update(
          { userId: id },
          derivedUser,
        );
      case Role.COMPANY_ADMIN:
        return await this.companyAdminRepository.update(
          { userId: id },
          derivedUser,
        );
      case Role.SITE_ADMIN:
        return await this.siteAdminRepository.update(
          { userId: id },
          derivedUser,
        );
      case Role.SECURITY_GUARD:
        return await this.securityGuardRepository.update(
          { userId: id },
          derivedUser,
        );
      case Role.SITE_OWNER:
        return await this.siteOwnerRepository.update(
          { userId: id },
          derivedUser,
        );
      default:
        throw new NotFoundException('Invalid Role');
    }
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

  private dtoToUserEntity(dto: any, role: Role) {
    /* deriveUser contains fields that are specific to each type of user depending
     * on the role. On the other hand, the 'user' has the common fields shared
     * amongst all users of any type
     */
    const {
      firstName,
      lastName,
      phoneNumber,
      password,
      email,
      ...derivedUser
    } = dto;
    const user = {
      ...derivedUser,
      user: {
        firstName,
        lastName,
        phoneNumber,
        password,
        role,
        email,
      },
    };
    switch (role) {
      case Role.SUPER_ADMIN:
        return this.superAdminRepository.create(user) as any;
      case Role.COMPANY_ADMIN:
        return this.companyAdminRepository.create(user) as any;
      case Role.SITE_ADMIN:
        return this.siteAdminRepository.create(user) as any;
      case Role.SECURITY_GUARD:
        return this.securityGuardRepository.create(user) as any;
      case Role.SITE_OWNER:
        return this.siteOwnerRepository.create(user) as any;
      default:
        throw new BadRequestException('Invalid Role');
    }
  }
}
