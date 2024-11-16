import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from '@shift/entities/shift.entity';
import { Repository } from 'typeorm';
import { BaseService } from '@core/base/base.service';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';
import { isEmptyObject } from '@core/core.utils';
import { PermissionsService } from '@permissions/permissions.service';
import { Resource } from '@core/core.constants';

@Injectable()
export class ShiftService extends BaseService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createShiftDto: CreateShiftDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.SHIFT, createShiftDto, { throwError: true });
    const { securityGuards, site, type } = createShiftDto as any;
    // Delete any previous shifts for the site of the same type(time of the day)
    await Shift.delete({ site: { id: site.id }, type });

    const shift = this.shiftRepository.create({
      ...createShiftDto,
      site,
      securityGuards,
    });
    return await Shift.save(shift);
  }

  async findOne(id: number) {
    return await Shift.findOneBy({ id });
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    this.handleMissingUpdateValues(updateShiftDto);
    await this.permissionsService
      .can(this.user)
      .update(Resource.SHIFT, id, updateShiftDto, { throwError: true });
    const { securityGuards, type, site } = updateShiftDto as any;
    const shift = await Shift.findOneByOrFail({ id });
    if (securityGuards?.length) {
      await this.assignGuardsToShift(securityGuards, shift);
    }
    if (!isEmptyObject({ type, site })) {
      return await Shift.update(
        { id },
        this.shiftRepository.create({ type, site }),
      );
    }
  }

  private async assignGuardsToShift(
    securityGuards: SecurityGuard[],
    shift: Shift,
  ) {
    // Remove any shifts from the new guards and the guards currently attached
    // to the shift
    const _securityGuards = await this.unshiftGuards([
      ...shift.securityGuards,
      ...securityGuards,
    ]);
    // Assign only the new guards to the shift
    shift.securityGuards = _securityGuards.slice(shift.securityGuards.length);
    return await Shift.save(shift);
  }

  private async unshiftGuards(securityGuards: SecurityGuard[]) {
    const _securityGuards = securityGuards.map((securityGuard) => {
      securityGuard.shift = null;
      return securityGuard;
    });
    await this.securityGuardRepository.save(_securityGuards);
    return _securityGuards;
  }
  async remove(id: number) {
    return await Shift.delete({ id });
  }
}
