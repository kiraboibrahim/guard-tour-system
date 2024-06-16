import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityGuard } from './entities/security-guard.entity';
import { SecurityGuardService } from './security-guard.service';
import { SecurityGuardController } from './security-guard.controller';
import { UserModule } from '../user/user.module';
import { PatrolModule } from '../patrol/patrol.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityGuard]),
    forwardRef(() => UserModule),
    PatrolModule,
  ],
  controllers: [SecurityGuardController],
  providers: [SecurityGuardService],
  exports: [TypeOrmModule],
})
export class SecurityGuardModule {}
