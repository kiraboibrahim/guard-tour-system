import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
    return this.userService.createSecurityGuard(createSecurityGuardDto);
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
    const queryBuilder = this.patrolRepository
      .createQueryBuilder('patrol')
      .where('patrol.securityGuardId = :securityGuardId', {
        securityGuardId: +id,
      })
      .leftJoin('patrol.securityGuard', 'securityGuard')
      .orWhere('securityGuard.uniqueId = :uniqueId', { uniqueId: id });
    return await paginate(query, queryBuilder, PATROL_PAGINATION_CONFIG);
  }
}
