import { Injectable, NotFoundException } from '@nestjs/common';
import { In, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { Site } from '../site/entities/site.entity';
import {
  ADD_SECURITY_GUARDS_ACTION,
  REMOVE_SECURITY_GUARDS_ACTION,
} from './shift.constants';
import { GroupPatrolPlan } from '../patrol-plan/entities/patrol-plan.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SHIFT_PAGINATION_CONFIG } from './shift-pagination.config';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    @InjectRepository(GroupPatrolPlan)
    private groupPatrolPlanRepository: Repository<GroupPatrolPlan>,
  ) {}
  async create(createShiftDto: CreateShiftDto) {
    //const { companyId, role } = user;
    const { startTime, endTime, patrolFrequency, securityGuardIds } =
      createShiftDto;
    const { site }: { site: Site } = createShiftDto as any;
    // TODO: Check for permissions, user can create own or create any. Own = site.companyId === companyId
    const securityGuards = await this.validateSecurityGuards(securityGuardIds);
    const deployedSecurityGuards = await this.deploySecurityGuardsToSite(
      securityGuards,
      site,
    );
    const shift = this.shiftRepository.create({
      startTime,
      endTime,
      patrolFrequency,
      site: site,
      securityGuards: deployedSecurityGuards,
    });
    return await this.shiftRepository.save(shift);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.shiftRepository, SHIFT_PAGINATION_CONFIG);
  }

  async findOneById(id: number) {
    return await this.shiftRepository.findOneBy({ id });
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    const { securityGuardIds, securityGuardAction, ...shiftData } =
      updateShiftDto;
    // TODO: Check for authorization
    let shift = await this.shiftRepository.findOneByOrFail({ id });
    shift.startTime = shiftData.startTime || shift.startTime;
    shift.endTime = shiftData.endTime || shift.endTime;
    shift.patrolFrequency = shiftData.patrolFrequency || shift.patrolFrequency;
    if (shiftData) {
      // Update the other shift metadata
      shift = await this.shiftRepository.save(shift);
    }
    switch (securityGuardAction) {
      case ADD_SECURITY_GUARDS_ACTION:
        return await this.addSecurityGuardsToShift(shift, securityGuardIds);
      case REMOVE_SECURITY_GUARDS_ACTION:
        return await this.removeSecurityGuardsFromShift(
          shift,
          securityGuardIds,
        );
    }
  }
  private async removeSecurityGuardsFromShift(
    shift: Shift,
    securityGuardIds: number[],
  ) {
    const currentShiftSecurityGuards = [...shift.securityGuards];
    const removedSecurityGuards = currentShiftSecurityGuards.filter((sG) =>
      securityGuardIds.includes(sG.userId),
    );
    await this.unDeploySecurityGuardsFromSite(removedSecurityGuards);
    shift.securityGuards = currentShiftSecurityGuards.filter(
      (sG) => !securityGuardIds.includes(sG.userId),
    );
    return await this.shiftRepository.save(shift);
  }

  private async addSecurityGuardsToShift(
    shift: Shift,
    securityGuardIds: number[],
  ) {
    const newSecurityGuards =
      await this.validateSecurityGuards(securityGuardIds);
    const deployedSecurityGuards = await this.deploySecurityGuardsToSite(
      newSecurityGuards,
      shift.site,
    );
    shift.securityGuards = [...shift.securityGuards, ...deployedSecurityGuards];
    return await this.shiftRepository.save(shift);
  }

  private async deploySecurityGuardsToSite(
    securityGuards: SecurityGuard[],
    site: Site,
  ) {
    // Deploy to site to which shift is attached
    return await this.securityGuardRepository.save(
      securityGuards.map((sG) => {
        sG.deployedSiteId = site.id;
        return sG;
      }),
    );
  }

  private async unDeploySecurityGuardsFromSite(
    securityGuards: SecurityGuard[],
  ) {
    // Undeploy from site to which they were attached
    await this.securityGuardRepository.save(
      securityGuards.map((sG) => {
        sG.deployedSiteId = null;
        return sG;
      }),
    );
  }
  async remove(id: number) {
    return await this.shiftRepository.delete(id);
  }

  private async validateSecurityGuards(securityGuardIds: number[]) {
    // 1. Security guards to be added to shift shouldn't belong to any shifts already
    // 2. Security guards should belong to the company of one creating them
    const securityGuards = await this.securityGuardRepository.findBy({
      // companyId,
      shiftId: IsNull(),
      userId: In([...securityGuardIds]),
    });

    if (securityGuards.length !== securityGuardIds.length)
      throw new NotFoundException(
        "Some or all security guards already have shifts or don't exist",
      );
    return securityGuards;
  }
  async findShiftPatrolPlan(id: number) {
    return this.groupPatrolPlanRepository.findOneBy({ shiftId: id });
  }
}
