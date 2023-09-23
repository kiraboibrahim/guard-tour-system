import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { UpdatePatrolDto } from './dto/update-patrol.dto';

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
    return this.patrolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatrolDto: UpdatePatrolDto) {
    return this.patrolService.update(+id, updatePatrolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrolService.remove(+id);
  }
}
