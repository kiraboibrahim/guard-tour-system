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
import { COMPANY_PAGINATION_CONFIG } from './company.pagination';
import { Role } from '../roles/roles';
import { Auth } from '../auth/auth.decorators';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { Resource } from '../permissions/permissions';
import { AlsoAllow } from '../roles/roles.decorators';
import { User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';

@ApiTags('Companies')
@Auth(Role.SUPER_ADMIN)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @CanCreate(Resource.COMPANY)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.create(createCompanyDto);
  }

  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  @Get()
  @CanRead(Resource.COMPANY)
  async find(
    @Paginate() query: PaginateQuery,
    @User() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.find(query);
  }

  @Get(':id')
  @AlsoAllow(Role.COMPANY_ADMIN, Role.SITE_ADMIN, Role.SECURITY_GUARD)
  @CanRead(Resource.COMPANY)
  async findOne(@Param('id') id: string) {
    return await this.companyService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(Resource.COMPANY)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @CanDelete(Resource.COMPANY)
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
