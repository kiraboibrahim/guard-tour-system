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
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { COMPANY_PAGINATION_CONFIG } from '../../company/company-pagination.config';

@ApiTags('Company Admins')
@Controller('company-admins')
export class CompanyAdminController {
  constructor(private readonly companyAdminService: CompanyAdminService) {}

  @Post()
  async create(@Body() createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.companyAdminService.create(createCompanyAdminDto);
  }

  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.companyAdminService.findAll(query);
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
    await this.companyAdminService.update(+id, updateCompanyAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.companyAdminService.remove(+id);
  }
}
