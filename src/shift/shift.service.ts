import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { Site } from '../site/entities/site.entity';
import { ADD_SECURITY_GUARDS, REMOVE_SECURITY_GUARDS } from './shift.constants';
import { BaseService } from '../core/core.base';

@Injectable()
export class ShiftService extends BaseService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
  ) {
    super();
  }
  async create(createShiftDto: CreateShiftDto) {
    const { companyId } = this.user;
    const { startTime, endTime, patrolFrequency } = createShiftDto;
    const {
      site,
      securityGuards,
    }: { site: Site; securityGuards: SecurityGuard[] } = createShiftDto as any;
    if (this.user.isCompanyAdmin() && !site.belongsToCompany(companyId))
      throw new UnauthorizedException("You can't create a shift for this site");
    const validatedSecurityGuards =
      await this.validateSecurityGuards(securityGuards);
    /* First deploy security guards to site and then go ahead and create a shift
     with the deployed guards
    */
    const deployedSecurityGuards = await this.deploySecurityGuardsToSite(
      validatedSecurityGuards,
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
    const { action, startTime, endTime, patrolFrequency } = updateShiftDto;
    const { securityGuards }: { securityGuards: SecurityGuard[] } =
      updateShiftDto as any;
    const shift = await this.shiftRepository.findOneOrFail({
      where: { id },
      relations: { securityGuards: true, site: true },
    });
    // Update shift metadata: startTime, endTime, patrolFrequency
    await this.shiftRepository.update(
      { id },
      {
        startTime,
        endTime,
        patrolFrequency,
      },
    );
    switch (action) {
      case ADD_SECURITY_GUARDS:
        return await this.addSecurityGuardsToShift(shift, securityGuards);
      case REMOVE_SECURITY_GUARDS:
        return await this.removeSecurityGuardsFromShift(shift, securityGuards);
    }
  }
  private async removeSecurityGuardsFromShift(
    shift: Shift,
    securityGuards: SecurityGuard[],
  ) {
    const currentShiftSecurityGuards = [...shift.securityGuards];
    const securityGuardsBelongToShift = securityGuards.every((securityGuard) =>
      securityGuard.isInShift(shift.id),
    );
    if (!securityGuardsBelongToShift)
      throw new BadRequestException(
        'All security guards should belong to the shift',
      );
    const toBeRemovedSecurityGuardIds = securityGuards.map(
      (securityGuard) => securityGuard.userId,
    );
    shift.securityGuards = currentShiftSecurityGuards.filter(
      (securityGuard) =>
        !toBeRemovedSecurityGuardIds.includes(securityGuard.userId),
    );
    return await this.shiftRepository.save(shift);
  }

  private async addSecurityGuardsToShift(
    shift: Shift,
    securityGuards: SecurityGuard[],
  ) {
    const toBeDeployedSecurityGuards = await this.validateSecurityGuards(
      securityGuards,
      shift.siteId,
    );
    const deployedSecurityGuards = await this.deploySecurityGuardsToSite(
      toBeDeployedSecurityGuards,
      shift.site,
    );
    shift.securityGuards = [...shift.securityGuards, ...deployedSecurityGuards];
    return await this.shiftRepository.save(shift);
  }

  private async deploySecurityGuardsToSite(
    securityGuards: SecurityGuard[],
    site: Site,
  ) {
    const { id: siteId } = site;
    return await this.securityGuardRepository.save(
      securityGuards.map((securityGuard) => {
        securityGuard.deployedSiteId = siteId;
        return securityGuard;
      }),
    );
  }

  async remove(id: number) {
    return await this.shiftRepository.delete(id);
  }

  private async validateSecurityGuards(
    securityGuards: SecurityGuard[],
    siteId?: number,
  ) {
    /**
     *  1. Security guards to be added to shift shouldn't belong to any shifts already
     * 2. Security guards should belong to the company of one creating them(For company admins)
     **/
    const expectedCompanyId = this.user.isCompanyAdmin()
      ? this.user.companyId
      : securityGuards[0].companyId;
    /* Valid security guards are those guards who aren't deployed anywhere or guards
    that have been deployed to the given site(siteId) and have no shifts. Not being
    deployed anywhere implies you don't have a shift you are attached to. */
    const expectedSecurityGuards = securityGuards.filter((securityGuard) => {
      const canBeAddedToShift =
        securityGuard.isNotDeployed() ||
        (siteId &&
          securityGuard.isDeployedToSite(siteId) &&
          securityGuard.hasNoShift());
      return (
        canBeAddedToShift && securityGuard.belongsToCompany(expectedCompanyId)
      );
    });
    const invalidSecurityGuards =
      securityGuards.length !== expectedSecurityGuards.length;
    if (invalidSecurityGuards)
      throw new BadRequestException('Some or all security guards have shifts');
    return securityGuards;
  }

  async shiftBelongsToCompany(shiftId: number, companyId: number) {
    const shift = await this.shiftRepository.findOne({
      where: { id: shiftId },
      relations: { site: true },
    });
    return !!shift && shift.site.belongsToCompany(companyId);
  }
}
