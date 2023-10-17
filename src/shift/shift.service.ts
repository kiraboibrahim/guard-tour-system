import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
  ) {}
  async create(createShiftDto: CreateShiftDto) {
    //const { companyId, role } = user;
    const { startTime, endTime, patrolFrequency, securityGuardIds } =
      createShiftDto;
    const { site }: { site: Site } = createShiftDto as any;
    // TODO: Check for permissions, user can create own or create any. Own = site.companyId === companyId
    const securityGuards = await this.validateSecurityGuards(securityGuardIds);
    const shift = this.shiftRepository.create({
      startTime,
      endTime,
      patrolFrequency,
      site: site,
      securityGuards,
    });
    return await this.shiftRepository.save(shift);
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
        'Some security guards specified already have shifts',
      );
    return securityGuards;
  }
  async findAll() {
    return await this.shiftRepository.find();
  }

  async findOneById(id: number) {
    return await this.shiftRepository.findOneBy({ id });
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    const { securityGuardIds, securityGuardAction, ...shiftData } =
      updateShiftDto;
    // TODO: Check for authorization
    const shift = await this.shiftRepository.findOneByOrFail({ id });
    shift.startTime = shiftData.startTime || shift.startTime;
    shift.endTime = shiftData.endTime || shift.endTime;
    shift.patrolFrequency = shiftData.patrolFrequency || shift.patrolFrequency;
    switch (securityGuardAction) {
      case ADD_SECURITY_GUARDS_ACTION:
        await this.addSecurityGuardsToShift(shift, securityGuardIds);
        break;
      case REMOVE_SECURITY_GUARDS_ACTION:
        await this.removeSecurityGuardsFromShift(shift, securityGuardIds);
        break;
    }
    await this.shiftRepository.save(shift);
  }
  private async removeSecurityGuardsFromShift(
    shift: Shift,
    securityGuardIds: number[],
  ) {
    const currentShiftSecurityGuards = [...shift.securityGuards];
    shift.securityGuards = currentShiftSecurityGuards.filter((sG) =>
      securityGuardIds.includes(sG.userId),
    );
    return await this.shiftRepository.save(shift);
  }

  private async addSecurityGuardsToShift(
    shift: Shift,
    securityGuardIds: number[],
  ) {
    const securityGuards = await this.validateSecurityGuards(securityGuardIds);
    shift.securityGuards.push(...securityGuards);
    return await this.shiftRepository.save(shift);
  }

  async remove(id: number) {
    await this.shiftRepository.delete(id);
  }
}
