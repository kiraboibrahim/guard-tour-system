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
    const { site }: { site: Site } = createPatrolDto as any;
    if (site.hasIndividualPatrolType()) {
      return await this.createIndividualPatrol(createPatrolDto);
    }
    return await this.createGroupPatrol(createPatrolDto);
  }

  /**
   * TODO: Remove this method when the app has been updated
   */
  async createIndividualPatrol(createPatrolDto: CreatePatrolDto) {
    const { securityGuardUniqueId } = createPatrolDto;
    const {
      securityGuard,
      site,
    }: { securityGuard: SecurityGuard; site: Site } = createPatrolDto as any;
    if (!site.hasIndividualPatrolType() || !securityGuardUniqueId) {
      throw new BadRequestException(
        "Group patrol  isn't supported for this site",
      );
    }
    const patrol = this.patrolRepository.create({
      ...createPatrolDto,
      securityGuardUniqueId,
      site,
      siteId: site.id,
      securityGuard,
    });
    return this.patrolRepository.save(patrol);
  }

  async createGroupPatrol(createPatrolDto: CreatePatrolDto) {
    const { securityGuardsUniqueIds } = createPatrolDto;
    const {
      securityGuards,
      site,
    }: { securityGuards: SecurityGuard[]; site: Site } = createPatrolDto as any;

    const isGroupPatrol = securityGuardsUniqueIds?.length > 1;
    if (isGroupPatrol && site.hasIndividualPatrolType()) {
      throw new BadRequestException("Group patrol isn't supported for site");
    }

    const patrols = securityGuardsUniqueIds.map((securityGuardUniqueId) => {
      const securityGuard = securityGuards.find(
        (securityGuard) => securityGuard.uniqueId === securityGuardUniqueId,
      );
      return this.patrolRepository.create({
        ...createPatrolDto,
        securityGuardUniqueId,
        site,
        siteId: site.id,
        securityGuard,
      });
    });

    return await this.patrolRepository.save(patrols);
  }
}
