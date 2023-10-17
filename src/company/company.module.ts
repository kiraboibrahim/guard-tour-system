import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { SiteModule } from '../site/site.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UserModule),
    SiteModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
