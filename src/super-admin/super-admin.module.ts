import { forwardRef, Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { SuperAdmin } from './entities/super-admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuperAdmin]),
    forwardRef(() => UserModule),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [TypeOrmModule],
})
export class SuperAdminModule {}
