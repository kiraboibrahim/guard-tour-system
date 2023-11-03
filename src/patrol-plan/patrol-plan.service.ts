import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePatrolPlanDto } from './dto/update-patrol-plan.dto';
import { In, IsNull, Repository } from 'typeorm';
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
import { Device } from '../device/entities/device.entity';
import { Site } from '../site/entities/site.entity';
import { CreatePatrolPlanDto } from './dto/create-patrol-plan.dto';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { Shift } from '../shift/entities/shift.entity';

@Injectable()
export class PatrolPlanService {
  constructor(
    @InjectRepository(PatrolPlan)
    private patrolPlanRepository: Repository<PatrolPlan>,
    @InjectRepository(GroupPatrolPlan)
    private groupPatrolPlanRepository: Repository<GroupPatrolPlan>,
    @InjectRepository(IndividualPatrolPlan)
    private individualPatrolPlanRepository: Repository<IndividualPatrolPlan>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
  ) {}

  async create(createPatrolPlanDto: CreatePatrolPlanDto) {
    // Create a patrol plan for a security guard or a shift
    const { deviceIds } = createPatrolPlanDto;
    const {
      shift,
      securityGuard,
    }: { shift: Shift; securityGuard: SecurityGuard } =
      createPatrolPlanDto as any;
    const siteId =
      shift !== undefined ? shift.siteId : securityGuard.deployedSiteId;
    if (!siteId)
      throw new BadRequestException(
        'Shift or security guard needs to be deployed to a site',
      );
    const site = (await this.siteRepository.preload({ id: siteId })) as Site;
    const devices = await this.validateDevices(deviceIds, site.id);
    switch (site.patrolPlanType) {
      case GROUP_PATROL_PLAN:
        return await this.createGroupPatrolPlan(shift, devices);
      case INDIVIDUAL_PATROL_PLAN:
        return this.createIndividualPatrolPlan(securityGuard, devices);
      default:
        throw new NotFoundException('Patrol plan type not found');
    }
  }
  private async createGroupPatrolPlan(shift: Shift, devices: Device[]) {
    if (shift.hasPatrolPlan())
      throw new BadRequestException('Shift already has a patrol plan');
    const basePatrolPlan = this.patrolPlanRepository.create({
      patrolPlanType: GROUP_PATROL_PLAN,
      site: shift.site,
      devices,
    });
    const patrolPlan = this.groupPatrolPlanRepository.create({
      patrolPlan: basePatrolPlan,
      shiftId: shift.id,
      shift,
    });
    return await this.groupPatrolPlanRepository.save(patrolPlan);
  }
  private async createIndividualPatrolPlan(
    securityGuard: SecurityGuard,
    devices: Device[],
  ) {
    if (securityGuard.hasPatrolPlan() || securityGuard.isNotDeployedToAnySite())
      throw new BadRequestException(
        "Security guard already has a patrol plan or he hasn't been deployed to any site",
      );
    const basePatrolPlan = this.patrolPlanRepository.create({
      patrolPlanType: INDIVIDUAL_PATROL_PLAN,
      siteId: securityGuard.deployedSiteId as number,
      devices,
    });
    const patrolPlan = this.individualPatrolPlanRepository.create({
      patrolPlan: basePatrolPlan,
      securityGuardId: securityGuard.userId,
      securityGuard,
    });
    return await this.individualPatrolPlanRepository.save(patrolPlan);
  }
  private async validateDevices(deviceIds: number[], siteId: number) {
    // 1. Devices shouldn't belong to any patrol plan
    // 2. Devices should be installed on the site
    const devices = await this.deviceRepository.findBy({
      id: In([...deviceIds]),
      patrolPlanId: IsNull(),
      siteId,
    });
    if (devices.length !== deviceIds.length)
      throw new NotFoundException(
        "Devices need to be installed on site and shouldn't belong to any other patrol plan",
      );
    return devices;
  }
  async update(id: number, updatePatrolPlanDto: UpdatePatrolPlanDto) {
    /* Updates can only add or remove devices from the patrol plan */
    const patrolPlan = await this.patrolPlanRepository.findOneByOrFail({ id });
    const { deviceIds, action } = updatePatrolPlanDto;
    switch (action) {
      case ADD_DEVICES_ACTION:
        return await this.addDevicesToPatrolPlan(patrolPlan, deviceIds);
      case REMOVE_DEVICES_ACTION:
        return await this.removeDevicesFromPatrolPlan(patrolPlan, deviceIds);
    }
  }
  private async addDevicesToPatrolPlan(
    patrolPlan: PatrolPlan,
    deviceIds: number[],
  ) {
    const devices = await this.validateDevices(deviceIds, patrolPlan.siteId);
    patrolPlan.devices.push(...devices);
    return await this.patrolPlanRepository.save(patrolPlan);
  }
  private async removeDevicesFromPatrolPlan(
    patrolPlan: PatrolPlan,
    deviceIds: number[],
  ) {
    const currentPatrolPlanDevices = [...patrolPlan.devices];
    patrolPlan.devices = currentPatrolPlanDevices.filter((device) =>
      deviceIds.includes(device.id),
    );

    return await this.patrolPlanRepository.save(patrolPlan);
  }

  async remove(id: number) {
    return await this.patrolPlanRepository.delete(id);
  }
}
