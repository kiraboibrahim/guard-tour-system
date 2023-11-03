import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { SHIFT_PAGINATION_CONFIG } from './shift-pagination.config';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.create(createShiftDto);
  }

  @ApiPaginationQuery(SHIFT_PAGINATION_CONFIG)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.shiftService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftService.update(+id, updateShiftDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.shiftService.remove(+id);
  }

  @Get(':id/patrol-plan')
  async findShiftPatrolPlan(@Param('id') id: string) {
    return await this.shiftService.findShiftPatrolPlan(+id);
  }
}
