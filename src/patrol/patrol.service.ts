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
    return await this.createPatrol(createPatrolDto);
  }

  async createPatrol(createPatrolDto: CreatePatrolDto) {
    const { securityGuardsUniqueIds, securityGuardUniqueId } = createPatrolDto;
    const {
      securityGuard,
      securityGuards,
      site,
    }: {
      securityGuard: SecurityGuard;
      securityGuards: SecurityGuard[];
      site: Site;
    } = createPatrolDto as any;

    const patrols: Patrol[] = [];
    const deprecatedDTOUsed = !!securityGuardUniqueId;
    const updatedDTOUsed = !!securityGuardsUniqueIds;
    if (updatedDTOUsed) {
      const isGroupPatrol = securityGuardsUniqueIds?.length >= 2;
      if (isGroupPatrol && site.hasIndividualPatrolType()) {
        throw new BadRequestException("Group patrol isn't supported for site");
      }

      const _patrols = securityGuardsUniqueIds.map((securityGuardUniqueId) => {
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
      patrols.push(..._patrols);
    } else if (deprecatedDTOUsed) {
      patrols.push(
        this.patrolRepository.create({
          ...createPatrolDto,
          securityGuardUniqueId,
          site,
          siteId: site.id,
          securityGuard,
        }),
      );
    } else {
      throw new BadRequestException(
        'You have to specify either securityGuardUniqueId or securityGuardsUniqueIds',
      );
    }
    return await this.patrolRepository.save(patrols);
  }
}
