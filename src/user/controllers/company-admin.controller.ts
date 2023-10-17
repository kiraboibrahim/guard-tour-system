import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyAdminService } from '../services/company-admin.service';
import { CreateCompanyAdminDto } from '../dto/create-company-admin.dto';
import { UpdateCompanyAdminDto } from '../dto/update-company-admin.dto';

@Controller('company-admins')
export class CompanyAdminController {
  constructor(private readonly companyAdminService: CompanyAdminService) {}

  @Post()
  async create(@Body() createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.companyAdminService.create(createCompanyAdminDto);
  }

  @Get()
  async findAll() {
    return await this.companyAdminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companyAdminService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    return await this.companyAdminService.update(+id, updateCompanyAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.companyAdminService.remove(+id);
  }
}
