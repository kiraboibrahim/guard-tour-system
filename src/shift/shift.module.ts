import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { Shift } from './entities/shift.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shift]), forwardRef(() => UserModule)],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [TypeOrmModule, ShiftService],
})
export class ShiftModule {}
