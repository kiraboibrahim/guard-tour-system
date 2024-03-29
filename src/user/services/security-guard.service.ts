import { Injectable } from '@nestjs/common';
import { Brackets, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { SecurityGuard } from '../entities/security-guard.entity';
import { UserService } from './user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SECURITY_GUARD_PAGINATION_CONFIG } from '../pagination-config/security-guard-pagination.config';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { PATROL_PAGINATION_CONFIG } from '../../patrol/patrol-pagination.config';
import { BaseService } from '../../core/core.base';
import { PermissionsService } from '../../permissions/permissions.service';
import { Resource } from '../../permissions/permissions';

@Injectable()
export class SecurityGuardService extends BaseService {
  constructor(
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    private userService: UserService,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }

  async create(createSecurityGuardDto: CreateSecurityGuardDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SECURITY_GUARD, createSecurityGuardDto, {
        throwError: true,
      });
    // TODO: After creating a security guard, get all patrols with a guard's unique ID but without a security guard relation(null) and set them to the guard
    const securityGuard = await this.userService.createSecurityGuard(
      createSecurityGuardDto,
    );
    await this.fixNullGuardPatrols(securityGuard as SecurityGuard);
    return securityGuard;
  }

  async fixNullGuardPatrols(securityGuard: SecurityGuard) {
    // Get all the guard's patrols whose security guard field is null and set it to the
    // given guard
    let securityGuardPatrols = await this.patrolRepository.find({
      where: {
        securityGuardUniqueId: securityGuard.uniqueId,
        securityGuard: IsNull(),
      },
    });
    securityGuardPatrols = securityGuardPatrols.map((patrol) => {
      patrol.securityGuard = securityGuard;
      patrol.securityGuardId = securityGuard.userId;
      return patrol;
    });
    return this.patrolRepository.save(securityGuardPatrols);
  }

  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.SECURITY_GUARD)
      .with(query);
    this.filterOnUserCompany(query);
    return await paginate(
      query,
      this.securityGuardRepository,
      SECURITY_GUARD_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: string) {
    return await this.securityGuardRepository.findOne({
      where: [{ userId: +id }, { uniqueId: id }],
    });
  }

  async update(id: number, updateSecurityGuardDto: UpdateSecurityGuardDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.SECURITY_GUARD, id, updateSecurityGuardDto, {
        throwError: true,
      });
    return await this.userService.updateSecurityGuard(
      id,
      updateSecurityGuardDto,
    );
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }

  async findSecurityGuardPatrols(id: string, query: PaginateQuery) {
    if (this.user) {
      await this.permissionsService
        .can(this.user)
        .filter(Resource.PATROL)
        .with(query);
    } else {
      query.filter = {}; // turn off filtering for unauthenticated users
    }
    const patrolsQueryBuilder = this.patrolRepository
      .createQueryBuilder('patrol')
      .leftJoin('patrol.site', 'site')
      .leftJoin('patrol.securityGuard', 'securityGuard')
      .where(
        new Brackets((qb) => {
          qb.where('securityGuard.userId = :securityGuardId', {
            securityGuardId: +id,
          }).orWhere('patrol.securityGuardUniqueId = :uniqueId', {
            uniqueId: id,
          });
        }),
      );
    return await paginate(query, patrolsQueryBuilder, PATROL_PAGINATION_CONFIG);
  }
}
