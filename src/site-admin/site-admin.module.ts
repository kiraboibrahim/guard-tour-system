import { forwardRef, Module } from '@nestjs/common';
import { SiteAdminService } from './site-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteAdmin } from './entities/site-admin.entity';
import { SiteAdminController } from './site-admin.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteAdmin]),
    forwardRef(() => UserModule),
  ],
  controllers: [SiteAdminController],
  providers: [SiteAdminService],
  exports: [TypeOrmModule],
})
export class SiteAdminModule {}
