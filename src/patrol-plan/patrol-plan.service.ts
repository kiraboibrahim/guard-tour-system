import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdatePatrolPlanDto } from './dto/update-patrol-plan.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GroupPatrolPlan,
  IndividualPatrolPlan,
  PatrolPlan,
} from './entities/patrol-plan.entity';
import {
  ADD_DEVICES_ACTION,
  GROUP_PATROL_PLAN,
  INDIVIDUAL_PATROL_PLAN,
  REMOVE_DEVICES_ACTION,
} from './patrol-plan.constants';
import { Tag } from '../tag/entities/tag.entity';
import { Site } from '../site/entities/site.entity';
import { CreatePatrolPlanDto } from './dto/create-patrol-plan.dto';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { Shift } from '../shift/entities/shift.entity';
import { BaseService } from '../core/core.base';

@Injectable()
export class PatrolPlanService extends BaseService {
  constructor(
    @InjectRepository(PatrolPlan)
    private patrolPlanRepository: Repository<PatrolPlan>,
    @InjectRepository(GroupPatrolPlan)
    private groupPatrolPlanRepository: Repository<GroupPatrolPlan>,
    @InjectRepository(IndividualPatrolPlan)
    private individualPatrolPlanRepository: Repository<IndividualPatrolPlan>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
  ) {
    super();
  }

  async create(createPatrolPlanDto: CreatePatrolPlanDto) {
    this.validatePatrolPlanDto(createPatrolPlanDto);
    const {
      shift,
      securityGuard,
    }: { shift: Shift; securityGuard: SecurityGuard } =
      createPatrolPlanDto as any;
    const deployedSite = shift.site || securityGuard.deployedSite;
    const { tagIds } = createPatrolPlanDto;
    const tags = await this.validateTags(tagIds, deployedSite);
    await this.installTagsToSite(tags, deployedSite);
    switch (deployedSite.patrolPlanType) {
      case GROUP_PATROL_PLAN:
        return await this.createGroupPatrolPlan(shift, tags);
      case INDIVIDUAL_PATROL_PLAN:
        return await this.createIndividualPatrolPlan(securityGuard, tags);
    }
  }
  private validatePatrolPlanDto(dto: CreatePatrolPlanDto) {
    const {
      shift,
      securityGuard,
    }: { shift: Shift; securityGuard: SecurityGuard } = dto as any;
    const { companyId } = this.user;
    const invalidShift =
      !!shift &&
      !shift.belongsToCompany(companyId) &&
      this.user.isCompanyAdmin();
    const invalidSecurityGuard =
      !!securityGuard &&
      !securityGuard.belongsToCompany(companyId) &&
      this.user.isCompanyAdmin();
    if (invalidShift || invalidSecurityGuard)
      throw new UnauthorizedException('Invalid shift or security guard');
    const deployedSite = shift.site || securityGuard.deployedSite;
    if (
      deployedSite &&
      deployedSite.hasIndividualPatrolPlan() &&
      !securityGuard
    ) {
      throw new BadRequestException(
        "Security guard is missing or security guard isn't deployed to site",
      );
    } else if (deployedSite && deployedSite.hasGroupPatrolPlan() && !shift) {
      throw new BadRequestException('Shift is missing');
    }
    return true;
  }
  private async createGroupPatrolPlan(shift: Shift, tags: Tag[]) {
    const basePatrolPlan = this.patrolPlanRepository.create({
      patrolPlanType: GROUP_PATROL_PLAN,
      site: shift.site,
      tags: tags,
    });
    const patrolPlan = this.groupPatrolPlanRepository.create({
      patrolPlan: basePatrolPlan,
      shift,
    });
    return await this.groupPatrolPlanRepository.save(patrolPlan);
  }
  private async createIndividualPatrolPlan(
    securityGuard: SecurityGuard,
    tags: Tag[],
  ) {
    if (securityGuard.isNotDeployedToAnySite())
      throw new BadRequestException(
        "Security guard isn't been deployed to any site",
      );
    const basePatrolPlan = this.patrolPlanRepository.create({
      patrolPlanType: INDIVIDUAL_PATROL_PLAN,
      site: securityGuard.deployedSite,
      tags: tags,
    });
    const patrolPlan = this.individualPatrolPlanRepository.create({
      patrolPlan: basePatrolPlan,
      securityGuard,
    });
    return await this.individualPatrolPlanRepository.save(patrolPlan);
  }
  private async validateTags(tagIds: number[], site: Site) {
    const tags = await this.tagRepository
      .createQueryBuilder()
      .where('id IN (:...tagIds)', { tagIds })
      .andWhere('patrolPlanId IS NULL')
      .andWhere('siteId IS NULL')
      .orWhere('siteId=:siteId', { siteId: site.id })
      .getMany();
    const missingTags = tags.length !== tagIds.length;
    if (missingTags)
      throw new NotFoundException(
        'All or some tags have been used on another patrol plan',
      );
    return tags;
  }
  private async installTagsToSite(tags: Tag[], site: Site) {
    site.tags.push(...tags);
    await this.siteRepository.save(site);
  }
  async update(id: number, updatePatrolPlanDto: UpdatePatrolPlanDto) {
    const patrolPlan = await this.patrolPlanRepository.findOneOrFail({
      where: { id },
      relations: { site: true },
    });
    const { tagIds, action } = updatePatrolPlanDto;
    switch (action) {
      case ADD_DEVICES_ACTION:
        return await this.addTagsToPatrolPlan(patrolPlan, tagIds);
      case REMOVE_DEVICES_ACTION:
        return await this.removeTagsFromPatrolPlan(patrolPlan, tagIds);
    }
  }
  private async addTagsToPatrolPlan(patrolPlan: PatrolPlan, tagIds: number[]) {
    const tags = await this.validateTags(tagIds, patrolPlan.site);
    // Adding tags will require installing them to the site to be patrolled
    await this.installTagsToSite(tags, patrolPlan.site);
    patrolPlan.tags.push(...tags);
    return await this.patrolPlanRepository.save(patrolPlan);
  }
  private async removeTagsFromPatrolPlan(
    patrolPlan: PatrolPlan,
    tagIds: number[],
  ) {
    const currentPatrolPlanTags = [...patrolPlan.tags];
    patrolPlan.tags = currentPatrolPlanTags.filter((tag) =>
      tagIds.includes(tag.id),
    );
    return await this.patrolPlanRepository.save(patrolPlan);
  }
  async findOneById(id: number) {
    return await this.patrolPlanRepository.findOneBy({ id });
  }
  async remove(id: number) {
    return await this.patrolPlanRepository.delete(id);
  }

  async patrolPlanBelongsToCompany(patrolPlanId: number, companyId: number) {
    const patrolPlan = await this.patrolPlanRepository.findOne({
      where: { id: patrolPlanId },
      relations: { site: true },
    });
    return !!patrolPlan && patrolPlan.belongsToCompany(companyId);
  }
}
