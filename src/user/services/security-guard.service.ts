import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { SecurityGuard } from '../entities/security-guard.entity';
import { PermissionsService } from '../../permissions/permissions.service';
import { UserService } from './user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SECURITY_GUARD_PAGINATION_CONFIG } from '../pagination-config/security-guard-pagination.config';
import { Patrol } from '../../patrol/entities/patrol.entity';
import { PATROL_PAGINATION_CONFIG } from '../../patrol/patrol-pagination.config';
import {
  IndividualPatrolPlan,
  PatrolPlan,
} from '../../patrol-plan/entities/patrol-plan.entity';

@Injectable()
export class SecurityGuardService {
  constructor(
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    private userService: UserService,
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
    @InjectRepository(IndividualPatrolPlan)
    private securityGuardPatrolPlanRepository: Repository<IndividualPatrolPlan>,
    private permissionsService: PermissionsService,
  ) {}

  async create(createSecurityGuardDto: CreateSecurityGuardDto) {
    // TODO: CompanyId of companyAdmin should be === to companyId in DTO otherwise, throw Unauthorized exception
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
    // TODO: Authorize updates to the company(Only SuperAdmins update company 2 which security guard belongs)
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
    return this.securityGuardPatrolPlanRepository.findBy({
      securityGuardId: id,
    });
  }
}
