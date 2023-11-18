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
import { IndividualPatrolPlan } from '../../patrol-plan/entities/patrol-plan.entity';
import { BaseService } from '../../core/core.base';

@Injectable()
export class SecurityGuardService extends BaseService {
  constructor(
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    private userService: UserService,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
    @InjectRepository(IndividualPatrolPlan)
    private securityGuardPatrolPlanRepository: Repository<IndividualPatrolPlan>,
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

  async findAllSecurityGuardPatrols(id: number, query: PaginateQuery) {
    query.filter = { ...query.filter, securityGuardId: [`${id}`] };
    return await paginate(
      query,
      this.patrolRepository,
      PATROL_PAGINATION_CONFIG,
    );
  }

  async findSecurityGuardPatrolPlan(id: number) {
    const securityGuard = await this.securityGuardRepository.findOneOrFail({
      where: {
        userId: id,
      },
      relations: {
        shift: { patrolPlan: { patrolPlan: true } },
        patrolPlan: true,
        deployedSite: true,
      },
    });
    const { deployedSite } = securityGuard;
    if (deployedSite.hasGroupPatrolPlan()) {
      return securityGuard.shift.patrolPlan;
    } else {
      return securityGuard.patrolPlan;
    }
  }
}
