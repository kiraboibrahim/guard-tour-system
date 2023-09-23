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

@Controller('site-admins')
export class SiteAdminController {
  constructor(private readonly siteAdminService: SiteAdminService) {}

  @Post()
  create(@Body() createSiteAdminDto: CreateSiteAdminDto) {
    return this.siteAdminService.create(createSiteAdminDto);
  }

  @Get()
  findAll() {
    return this.siteAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteAdminService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSiteAdminDto: UpdateSiteAdminDto,
  ) {
    return this.siteAdminService.update(+id, updateSiteAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteAdminService.remove(+id);
  }
}
