import { forwardRef, Module } from '@nestjs/common';
import { CompanyAdminService } from './company-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyAdmin } from './entities/company-admin.entity';
import { CompanyAdminController } from './company-admin.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyAdmin]),
    forwardRef(() => UserModule),
  ],
  controllers: [CompanyAdminController],
  providers: [CompanyAdminService],
  exports: [TypeOrmModule],
})
export class CompanyAdminModule {}
