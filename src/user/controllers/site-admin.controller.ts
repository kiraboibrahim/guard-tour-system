import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SiteAdminService } from '../services/site-admin.service';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { SITE_ADMIN_PAGINATION_CONFIG } from '../pagination-config/site-admin-pagination.config';

@ApiTags('Site Admins')
@Controller('site-admins')
export class SiteAdminController {
  constructor(private readonly siteAdminService: SiteAdminService) {}

  @Post()
  create(@Body() createSiteAdminDto: CreateSiteAdminDto) {
    return this.siteAdminService.create(createSiteAdminDto);
  }

  @ApiPaginationQuery(SITE_ADMIN_PAGINATION_CONFIG)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.siteAdminService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteAdminService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSiteAdminDto: UpdateSiteAdminDto,
  ) {
    await this.siteAdminService.update(+id, updateSiteAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.siteAdminService.remove(+id);
  }
}
