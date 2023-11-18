import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { BaseService } from '../core/core.base';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class ShiftService extends BaseService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    @InjectRepository(GroupPatrolPlan)
    private groupPatrolPlanRepository: Repository<GroupPatrolPlan>,
  ) {
    super();
  }
  async create(createShiftDto: CreateShiftDto) {
    const { companyId } = this.user;
    const { startTime, endTime, patrolFrequency, securityGuardIds } =
      createShiftDto;
    const { site }: { site: Site } = createShiftDto as any;
    // Only super admins and company admins can create shifts
    if (this.user.isCompanyAdmin() && !site.belongsToCompany(companyId))
      throw new UnauthorizedException("You can't create shift for this site");
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

  async findOneById(id: number) {
    return await this.shiftRepository.findOneBy({ id });
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    const { securityGuardIds, securityGuardAction, ...shiftData } =
      updateShiftDto;
    let shift = await this.shiftRepository.findOneByOrFail({ id });
    shift.startTime = shiftData.startTime || shift.startTime;
    shift.endTime = shiftData.endTime || shift.endTime;
    shift.patrolFrequency = shiftData.patrolFrequency || shift.patrolFrequency;
    if (shiftData) {
      // Update the other shift metadata: startTime, endTime, patrolFrequency
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
    const companyId = this.user.isCompanyAdmin()
      ? this.user.companyId
      : undefined;
    const securityGuards = await this.securityGuardRepository.findBy({
      companyId,
      shiftId: IsNull(),
      userId: In([...securityGuardIds]),
    });

    if (securityGuards.length !== securityGuardIds.length)
      throw new NotFoundException(
        "Some security guards already have shifts or don't exist",
      );
    return securityGuards;
  }
  async findShiftPatrolPlan(id: number) {
    return this.groupPatrolPlanRepository.findOneBy({ shiftId: id });
  }
  async shiftBelongsToCompany(shiftId: number, companyId: number) {
    const shift = await this.shiftRepository.findOne({
      where: { id: shiftId },
      relations: { site: true },
    });
    return !!shift && shift.site.belongsToCompany(companyId);
  }
}
