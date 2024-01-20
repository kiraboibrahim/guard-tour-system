import { Controller, Post, Body } from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, IsPublic } from '../auth/auth.decorators';
import { Role } from '../roles/roles';

@ApiTags('Patrols')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('patrols')
export class PatrolController {
  constructor(private readonly patrolService: PatrolService) {}

  @Post()
  @IsPublic()
  create(@Body() createPatrolDto: CreatePatrolDto) {
    return this.patrolService.create(createPatrolDto);
  }
}
