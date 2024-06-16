import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { SiteModule } from '../site/site.module';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    SiteModule,
    TagModule,
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UserModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
