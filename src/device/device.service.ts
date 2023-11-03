import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { Site } from '../site/entities/site.entity';
import { PatrolPlan } from '../patrol-plan/entities/patrol-plan.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { DEVICE_PAGINATION_CONFIG } from './device-pagination.config';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}
  async create(createDeviceDto: CreateDeviceDto) {
    // TODO: Move this validation to dto
    if (!(await this.isUniqueDevice(createDeviceDto)))
      throw new BadRequestException(
        'serialNumber, partNumber, IMEI, simId should be unique',
      );
    const { site }: { site: Site } = createDeviceDto as any;
    const device = this.deviceRepository.create({ site, ...createDeviceDto });
    return await this.deviceRepository.save(device);
  }
  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.deviceRepository,
      DEVICE_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.deviceRepository.findOneBy({ id });
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    if (!(await this.isUniqueDevice(updateDeviceDto)))
      throw new BadRequestException(
        'serialNumber, partNumber, IMEI, simId should be unique',
      );
    const {
      siteId,
      site,
      ...deviceData
    }: { siteId: number; site: Site; patrolPlan: PatrolPlan } =
      updateDeviceDto as any;
    return await this.deviceRepository.update(
      { id },
      { site, siteId, ...deviceData },
    );
  }

  private async isUniqueDevice(deviceDto: CreateDeviceDto | UpdateDeviceDto) {
    const { serialNumber, partNumber, IMEI, simId } = deviceDto;
    if (!serialNumber && !partNumber && !IMEI && !simId) return true;
    const device = await this.deviceRepository.findOneBy([
      { serialNumber },
      { partNumber },
      { IMEI },
      { simId },
    ]);
    return device === null;
  }
  async remove(id: number) {
    return await this.deviceRepository.delete(id);
  }
}
