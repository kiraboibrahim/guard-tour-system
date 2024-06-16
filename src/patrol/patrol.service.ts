import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { Patrol } from './entities/patrol.entity';
import { SecurityGuard } from '../security-guard/entities/security-guard.entity';
import { BaseService } from '../core/services/base.service';
import { Site } from '../site/entities/site.entity';

@Injectable()
export class PatrolService extends BaseService {
  constructor(
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
  ) {
    super();
  }
  async create(createPatrolDto: CreatePatrolDto) {
    /* Alert: No permission checks done here. This means anyone can create a patrol(even false patrols)
    TODO: Add another form of authentication to the function of creating patrols i.e biometric auth */
    const { securityGuardsUniqueIds } = createPatrolDto;
    const {
      securityGuards,
      site,
    }: { securityGuards: SecurityGuard[]; site: Site } = createPatrolDto as any;

    const isGroupPatrol = securityGuardsUniqueIds.length > 1;
    if (isGroupPatrol && site.hasIndividualPatrolType()) {
      throw new BadRequestException("Group patrol isn't supported for site");
    }

    const patrols = securityGuardsUniqueIds.map((securityGuardUniqueId) => {
      const securityGuard = securityGuards.filter(
        (securityGuard) => securityGuard.uniqueId === securityGuardUniqueId,
      )[0];
      const securityGuardId = !!securityGuard
        ? securityGuard.userId
        : undefined;
      return this.patrolRepository.create({
        ...createPatrolDto,
        securityGuardId,
        securityGuardUniqueId,
        site,
        siteId: site.id,
      });
    });

    return await this.patrolRepository.save(patrols);
  }
}
