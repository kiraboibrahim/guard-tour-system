import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { Patrol } from './entities/patrol.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { BaseService } from '../core/core.base';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Site } from '../site/entities/site.entity';

@Injectable()
export class PatrolService extends BaseService {
  constructor(
    @InjectRepository(Patrol) private patrolRepository: Repository<Patrol>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createPatrolDto: CreatePatrolDto) {
    // Alert: No permission checks done here. This means anyone can create a patrol(even false patrols)
    // TODO: Add another form of authentication to the function of creating patrols i.e biometric auth
    const {
      securityGuard,
      site,
    }: { securityGuard: SecurityGuard; site: Site } = createPatrolDto as any;

    const securityGuardId = !!securityGuard ? securityGuard.userId : undefined;
    const patrol = this.patrolRepository.create({
      ...createPatrolDto,
      securityGuardId,
      securityGuard,
      site,
      siteId: site.id,
    });
    return await this.patrolRepository.save(patrol);
  }
}
