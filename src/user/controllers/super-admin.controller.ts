import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SuperAdminService } from '../services/super-admin.service';
import { CreateSuperAdminDto } from '../dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from '../dto/update-super-admin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Super Admins')
@Controller('super-admins')
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}

  @Post()
  create(@Body() createSuperAdminDto: CreateSuperAdminDto) {
    return this.superAdminService.create(createSuperAdminDto);
  }

  @Get()
  findAll() {
    return this.superAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.superAdminService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSuperAdminDto: UpdateSuperAdminDto,
  ) {
    await this.superAdminService.update(+id, updateSuperAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.superAdminService.remove(+id);
  }
}
