import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { Site } from '../site/entities/site.entity';
import { PatrolPlan } from '../patrol-plan/entities/patrol-plan.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}
  async create(createDeviceDto: CreateDeviceDto) {
    // TODO: Move this validation to dto
    if (!(await this.isValidDeviceDto(createDeviceDto)))
      throw new BadRequestException(
        'serialNumber, partNumber, IMEI, simId should be unique',
      );
    const { site }: { site: Site } = createDeviceDto as any;
    const device = this.deviceRepository.create({ site, ...createDeviceDto });
    return await this.deviceRepository.save(device);
  }
  private async isValidDeviceDto(deviceDto: CreateDeviceDto | UpdateDeviceDto) {
    const { serialNumber, partNumber, IMEI, simId } = deviceDto;
    const device = await this.deviceRepository.findOneBy([
      { serialNumber },
      { partNumber },
      { IMEI },
      { simId },
    ]);
    return device === null;
  }
  async findAll() {
    return await this.deviceRepository.find();
  }

  async findOneById(id: number) {
    return await this.deviceRepository.findOneBy({ id });
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    if (!(await this.isValidDeviceDto(updateDeviceDto)))
      throw new BadRequestException(
        'serialNumber, partNumber, IMEI, simId should be unique',
      );
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      siteId,
      site,
      ...deviceData
    }: { siteId: number; site: Site; patrolPlan: PatrolPlan } =
      updateDeviceDto as any;
    await this.deviceRepository.update({ id }, { site, ...deviceData });
  }

  async remove(id: number) {
    await this.deviceRepository.delete(id);
  }
}
