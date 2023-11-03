import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sites')
@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.create(createSiteDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.siteService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOneById(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    await this.siteService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.siteService.remove(+id);
  }
  @Get(':id/shifts')
  async findAllSiteShifts(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.siteService.findAllSiteShifts(+id, query);
  }

  @Get(':id/devices')
  async findAllSiteDevices(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.siteService.findAllSiteDevices(+id, query);
  }
  @Get(':id/patrols')
  async findAllSitePatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.siteService.findAllSitePatrols(+id, query);
  }

  @Get(':id/device-count')
  async findSiteDevicesCount(@Param('id') id: string) {
    return await this.siteService.findSiteDevicesCount(+id);
  }
}
