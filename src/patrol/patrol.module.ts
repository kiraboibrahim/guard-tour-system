import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatrolService } from './patrol.service';
import { PatrolController } from './patrol.controller';
import { Patrol } from './entities/patrol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patrol])],
  controllers: [PatrolController],
  providers: [PatrolService],
})
export class PatrolModule {}
