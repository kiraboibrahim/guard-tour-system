import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '@shift/entities/shift.entity';
import { SecurityGuard } from '@security-guard/entities/security-guard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, SecurityGuard])],
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule {}
