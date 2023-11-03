import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { COMPANY_PAGINATION_CONFIG } from './company-pagination.config';
import { SITE_PAGINATION_CONFIG } from '../site/site-pagination.config';
import { SECURITY_GUARD_PAGINATION_CONFIG } from '../user/pagination-config/security-guard-pagination.config';
import { RequiredRoles } from '../roles/roles.decorators';
import { SUPER_ADMIN_ROLE } from '../roles/roles.constants';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.companyService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companyService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @ApiPaginationQuery(SITE_PAGINATION_CONFIG)
  @Get(':id/sites')
  async findAllCompanySites(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.companyService.findAllCompanySites(+id, query);
  }

  @ApiPaginationQuery(SECURITY_GUARD_PAGINATION_CONFIG)
  @Get(':id/security-guards')
  async findAllCompanySecurityGuards(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.companyService.findAllCompanySecurityGuards(+id, query);
  }
}
