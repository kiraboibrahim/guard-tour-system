import { forwardRef, Module } from '@nestjs/common';
import { SiteOwnerService } from './site-owner.service';
import { SiteOwnerController } from './site-owner.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteOwner } from './entities/site-owner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteOwner]),
    forwardRef(() => UserModule),
  ],
  controllers: [SiteOwnerController],
  providers: [SiteOwnerService],
  exports: [TypeOrmModule],
})
export class SiteOwnerModule {}
