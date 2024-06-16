import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyAdminService } from './company-admin.service';
import { CreateCompanyAdminDto } from './dto/create-company-admin.dto';
import { UpdateCompanyAdminDto } from './dto/update-company-admin.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { COMPANY_PAGINATION_CONFIG } from '../company/company.pagination';
import { Auth, User } from '../auth/auth.decorators';
import { Role } from '../roles/roles';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { Resource } from '../permissions/permissions';
import { AlsoAllow } from '../roles/roles.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';

@ApiTags('Company Admins')
@Auth(Role.SUPER_ADMIN)
@Controller('users/company-admins')
export class CompanyAdminController {
  constructor(private readonly companyAdminService: CompanyAdminService) {}

  @Post()
  @CanCreate(Resource.COMPANY_ADMIN)
  async create(
    @Body() createCompanyAdminDto: CreateCompanyAdminDto,
    @User() user: AuthenticatedUser,
  ) {
    this.companyAdminService.setUser(user);
    return await this.companyAdminService.create(createCompanyAdminDto);
  }

  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  @Get()
  @CanRead(Resource.COMPANY_ADMIN)
  async find(
    @Paginate() query: PaginateQuery,
    @User() user: AuthenticatedUser,
  ) {
    this.companyAdminService.setUser(user);
    return await this.companyAdminService.find(query);
  }

  @Get(':id')
  @AlsoAllow(Role.COMPANY_ADMIN)
  @CanRead(Resource.COMPANY_ADMIN, undefined, {
    [Resource.COMPANY_ADMIN]: 'id',
  })
  async findOne(@Param('id') id: string) {
    return await this.companyAdminService.findOneById(+id);
  }

  @Patch(':id')
  @AlsoAllow(Role.COMPANY_ADMIN)
  @CanUpdate(Resource.COMPANY_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyAdminDto: UpdateCompanyAdminDto,
    @User() user: AuthenticatedUser,
  ) {
    this.companyAdminService.setUser(user);
    return await this.companyAdminService.update(+id, updateCompanyAdminDto);
  }

  @Delete(':id')
  @CanDelete(Resource.COMPANY_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.companyAdminService.remove(+id);
  }
}
