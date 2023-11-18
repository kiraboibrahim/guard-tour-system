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
import { AuthRequired } from '../../auth/auth.decorators';
import {
  COMPANY_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../../roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../../permissions/permissions.decorators';
import { COMPANY_ADMIN_RESOURCE } from '../../permissions/permissions';
import { AlsoAllow } from '../../roles/roles.decorators';

@ApiTags('Company Admins')
@AuthRequired(SUPER_ADMIN_ROLE)
@Controller('company-admins')
export class CompanyAdminController {
  constructor(private readonly companyAdminService: CompanyAdminService) {}

  @Post()
  @CanCreate(COMPANY_ADMIN_RESOURCE)
  async create(@Body() createCompanyAdminDto: CreateCompanyAdminDto) {
    return await this.companyAdminService.create(createCompanyAdminDto);
  }

  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  @Get()
  @CanRead(COMPANY_ADMIN_RESOURCE)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.companyAdminService.findAll(query);
  }

  @Get(':id')
  @AlsoAllow(COMPANY_ADMIN_ROLE)
  @CanRead(COMPANY_ADMIN_RESOURCE)
  async findOne(@Param('id') id: string) {
    return await this.companyAdminService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(COMPANY_ADMIN_RESOURCE)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyAdminDto: UpdateCompanyAdminDto,
  ) {
    await this.companyAdminService.update(+id, updateCompanyAdminDto);
  }

  @Delete(':id')
  @CanDelete(COMPANY_ADMIN_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.companyAdminService.remove(+id);
  }
}
