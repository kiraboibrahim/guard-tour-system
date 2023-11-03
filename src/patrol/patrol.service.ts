import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalTime } from '@js-joda/core';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { Patrol } from './entities/patrol.entity';
import { Shift } from '../shift/entities/shift.entity';
import { Site } from '../site/entities/site.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PATROL_PAGINATION_CONFIG } from './patrol-pagination.config';

@Injectable()
export class PatrolService {
  constructor(
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {}
  async create(createPatrolDto: CreatePatrolDto) {
    this.validatePatrol(createPatrolDto);
    const patrol = this.patrolRepository.create(createPatrolDto);
    return this.patrolRepository.save(patrol);
  }
  private validatePatrol(createPatrolDto: CreatePatrolDto) {
    const {
      shift,
      site,
      securityGuard,
    }: { shift: Shift; site: Site; securityGuard: SecurityGuard } =
      createPatrolDto as any;
    const { startTime, endTime } = createPatrolDto;
    if (!shift.belongsToSite(site)) {
      throw new BadRequestException(
        "Security guard isn't deployed to the site",
      );
    }
    if (!securityGuard.belongsToShift(shift)) {
      throw new BadRequestException(
        "Security guard doesn't belong to the shift",
      );
    }
    if (!this.isOnTimePatrol(shift, startTime, endTime)) {
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
  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.patrolRepository,
      PATROL_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.patrolRepository.findOneBy({ id });
  }
}
