import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { UnDeploySecurityGuardsDto } from '../dto/undeploy-security-guards.dto';

@Injectable()
export class SecurityGuardService extends BaseService {
  constructor(
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    private userService: UserService,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {
    super();
  }

  async create(createSecurityGuardDto: CreateSecurityGuardDto) {
    const { companyId: expectedCompanyId } = this.user;
    const { companyId: givenCompanyId } = createSecurityGuardDto;
    const invalidCompanyId = givenCompanyId !== expectedCompanyId;
    if (this.user.isCompanyAdmin() && invalidCompanyId)
      throw new UnauthorizedException('Invalid company');
    return this.userService.createSecurityGuard(createSecurityGuardDto);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.securityGuardRepository,
      SECURITY_GUARD_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.securityGuardRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSecurityGuardDto: UpdateSecurityGuardDto) {
    return await this.userService.updateSecurityGuard(
      id,
      updateSecurityGuardDto,
    );
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
  async unDeploySecurityGuards(
    unDeploySecurityGuardsDto: UnDeploySecurityGuardsDto,
  ) {
    /* UnDeploying a security guard implies nullifying both the deployedSiteId
    and the ShiftId. The shiftId is nullified because a security guard can't have
    a shift and yet their deployedSiteId is null */
    const { securityGuards }: { securityGuards: SecurityGuard[] } =
      unDeploySecurityGuardsDto as any;
    const userCompanyId = this.user.isCompanyAdmin()
      ? this.user.companyId
      : securityGuards[0].companyId;
    const securityGuardsBelongToUserCompany = securityGuards.every(
      (securityGuard) => securityGuard.belongsToCompany(userCompanyId),
    );
    if (!securityGuardsBelongToUserCompany) throw new UnauthorizedException();
    const toBeUnDeployedSecurityGuards = securityGuards.map((securityGuard) => {
      securityGuard.deployedSiteId = null;
      securityGuard.shiftId = null;
      return securityGuard;
    });
    return await this.securityGuardRepository.save(
      toBeUnDeployedSecurityGuards,
    );
  }
  async findAllSecurityGuardPatrols(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, securityGuardId: [`${id}`] };
    return await paginate(
      query,
      this.patrolRepository,
      PATROL_PAGINATION_CONFIG,
    );
  }
}
