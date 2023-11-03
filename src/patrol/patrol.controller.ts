import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PatrolService } from './patrol.service';
import { CreatePatrolDto } from './dto/create-patrol.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { PATROL_PAGINATION_CONFIG } from './patrol-pagination.config';

@ApiTags('Patrols')
@Controller('patrols')
export class PatrolController {
  constructor(private readonly patrolService: PatrolService) {}

  @Post()
  create(@Body() createPatrolDto: CreatePatrolDto) {
    return this.patrolService.create(createPatrolDto);
  }

  @ApiPaginationQuery(PATROL_PAGINATION_CONFIG)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.patrolService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrolService.findOneById(+id);
  }
}
