import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalTime } from '@js-joda/core';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { Patrol } from './entities/patrol.entity';
import { Shift } from '../shift/entities/shift.entity';
import { Site } from '../site/entities/site.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';

@Injectable()
export class PatrolService {
  constructor(
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {}
  async create(createPatrolDto: CreatePatrolDto) {
    if (this.isValidPatrol(createPatrolDto)) {
      const patrol = this.patrolRepository.create(createPatrolDto);
      return this.patrolRepository.save(patrol);
    }
    throw new BadRequestException();
  }
  private isValidPatrol(createPatrolDto: CreatePatrolDto) {
    const {
      shift,
      site,
      securityGuard,
    }: { shift: Shift; site: Site; securityGuard: SecurityGuard } =
      createPatrolDto as any;
    const { startTime, endTime } = createPatrolDto;
    return (
      this.siteHasShift(site, shift) &&
      this.securityGuardBelongsToShift(securityGuard, shift) &&
      this.isOnTimePatrol(shift.startTime, shift.endTime, startTime, endTime)
    );
  }
  private securityGuardBelongsToShift(
    securityGuard: SecurityGuard,
    shift: Shift,
  ) {
    return securityGuard.shift?.id === shift.id;
  }

  private siteHasShift(site: Site, shift: Shift) {
    return shift.site.id === site.id;
  }

  private isOnTimePatrol(
    shiftStartTime: string,
    shiftEndTime: string,
    patrolStartTime: string,
    patrolEndTime: string,
  ) {
    const _shiftStartTime = LocalTime.parse(shiftStartTime);
    const _shiftEndTime = LocalTime.parse(shiftEndTime);
    const _patrolStartTime = LocalTime.parse(patrolStartTime);
    const _patrolEndTime = LocalTime.parse(patrolEndTime);
    return (
      _patrolStartTime.isAfter(_shiftStartTime) &&
      _patrolEndTime.isBefore(_shiftEndTime)
    );
  }
  async findAll() {
    return await this.patrolRepository.find();
  }

  async findOneById(id: number) {
    return await this.patrolRepository.findOneBy({ id });
  }
}
