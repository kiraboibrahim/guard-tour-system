import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';

@Controller('patrols')
export class PatrolController {
  constructor(private readonly patrolService: PatrolService) {}

  @Post()
  create(@Body() createPatrolDto: CreatePatrolDto) {
    return this.patrolService.create(createPatrolDto);
  }

  @Get()
  findAll() {
    return this.patrolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrolService.findOneById(+id);
  }
}
