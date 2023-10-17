import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { Shift } from './entities/shift.entity';
import { UserModule } from '../user/user.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shift]), UserModule, DeviceModule],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [TypeOrmModule],
})
export class ShiftModule {}
