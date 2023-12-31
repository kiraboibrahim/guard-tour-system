import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalTime } from '@js-joda/core';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { Patrol } from './entities/patrol.entity';
import { Shift } from '../shift/entities/shift.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { BaseService } from '../core/core.base';

@Injectable()
export class PatrolService extends BaseService {
  constructor(
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {
    super();
  }
  async create(createPatrolDto: CreatePatrolDto) {
    this.validatePatrol(createPatrolDto);
    const { securityGuard }: { securityGuard: SecurityGuard } =
      createPatrolDto as any;
    const { deployedSite: site, shift } = securityGuard;
    const patrol = this.patrolRepository.create({
      ...createPatrolDto,
      site,
      shift,
    });
    return this.patrolRepository.save(patrol);
  }
  private validatePatrol(createPatrolDto: CreatePatrolDto) {
    const { securityGuard }: { securityGuard: SecurityGuard } =
      createPatrolDto as any;
    const { startTime, endTime } = createPatrolDto;
    if (!securityGuard.deployedSite) {
      throw new BadRequestException("Security guard isn't deployed to site");
    }
    if (!this.isOnTimePatrol(securityGuard.shift, startTime, endTime)) {
      throw new BadRequestException('Patrol is so early or late');
    }
    return true;
  }

  private isOnTimePatrol(
    securityGuardShift: Shift,
    patrolStartTime: string,
    patrolEndTime: string,
  ) {
    const _shiftStartTime = LocalTime.parse(securityGuardShift.startTime);
    const _shiftEndTime = LocalTime.parse(securityGuardShift.endTime);
    const _patrolStartTime = LocalTime.parse(patrolStartTime);
    const _patrolEndTime = LocalTime.parse(patrolEndTime);
    return (
      _patrolStartTime.isAfter(_shiftStartTime) &&
      _patrolEndTime.isBefore(_shiftEndTime)
    );
  }
}
