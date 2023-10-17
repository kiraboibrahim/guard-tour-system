import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(SecurityGuard)
    private securityGuardRepository: Repository<SecurityGuard>,
  ) {}

  async create(createPatrolPlanDto: CreatePatrolPlanDto) {
    // Create a patrol plan for a security guard or a shift
    const { site }: { site: Site } = createPatrolPlanDto as any;
    const { shiftId, securityGuardId, deviceIds } = createPatrolPlanDto;
    const devices = await this.validateSiteDevices(deviceIds, site.id);
    switch (site.patrolPlanSetting) {
      case GROUP_PATROL_PLAN:
        const shift = await this.shiftRepository.findOneByOrFail({
          id: shiftId,
          siteId: site.id,
        });
        return await this.createGroupPatrolPlan(shift, devices);
      case INDIVIDUAL_PATROL_PLAN:
        const securityGuard =
          await this.securityGuardRepository.findOneByOrFail({
            userId: securityGuardId,
          });
        if (!securityGuard.isDeployedToSite(site))
          throw new UnauthorizedException();
        return this.createIndividualPatrolPlan(securityGuard, devices);
    }
  }
  private async createGroupPatrolPlan(shift: Shift, devices: Device[]) {
    const basePatrolPlan = this.patrolPlanRepository.create({
      patrolPlanType: GROUP_PATROL_PLAN,
      site: shift.site,
      devices,
    });
    const patrolPlan = this.groupPatrolPlanRepository.create({
      patrolPlan: basePatrolPlan,
      shift,
    });
    return this.groupPatrolPlanRepository.save(patrolPlan);
  }
  private async createIndividualPatrolPlan(
    securityGuard: SecurityGuard,
    devices: Device[],
  ) {
    const basePatrolPlan = this.patrolPlanRepository.create({
      patrolPlanType: INDIVIDUAL_PATROL_PLAN,
      site: securityGuard.deployedSite,
      devices,
    });
    const patrolPlan = this.individualPatrolPlanRepository.create({
      patrolPlan: basePatrolPlan,
      securityGuard,
    });
    return this.individualPatrolPlanRepository.save(patrolPlan);
  }
  private async validateSiteDevices(deviceIds: number[], siteId: number) {
    // 1. Devices shouldn't belong to any patrol plan
    // 2. Devices should be installed on the site
    const devices = await this.deviceRepository.findBy({
      id: In([...deviceIds]),
      patrolPlanId: IsNull(),
      siteId,
    });
    if (devices.length !== deviceIds.length)
      throw new NotFoundException(
        "Make sure devices are installed on site and don't belong to any other patrol plan",
      );
    return devices;
  }
  async update(id: number, updatePatrolPlanDto: UpdatePatrolPlanDto) {
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
    const devices = await this.validateSiteDevices(
      deviceIds,
      patrolPlan.siteId,
    );
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
