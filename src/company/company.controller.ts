import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { COMPANY_PAGINATION_CONFIG } from './company.pagination';
import { Role } from '@roles/roles.constants';
import { Auth, GetUser } from '@auth/auth.decorators';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '@permissions/permissions.decorators';
import { AllowOnly, AlsoAllow } from '@roles/roles.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';
import { UploadCompanyLogoDto } from './dto/upload-company-logo.dto';
import { PhotoFieldInterceptor } from '@core/core.interceptors';
import { Resource } from '@core/core.constants';
import UpdateThemeDto from '@company/dto/update-theme.dto';
import CreateThemeDto from '@company/dto/create-theme.dto';

@ApiTags('Companies')
@Auth(Role.SUPER_ADMIN)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('themes')
  @AllowOnly(Role.COMPANY_ADMIN)
  @CanCreate(Resource.THEME)
  async createTheme(
    @Body() createThemeDto: CreateThemeDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.createTheme(createThemeDto);
  }

  @Post()
  @CanCreate(Resource.COMPANY)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.create(createCompanyDto);
  }

  @ApiPaginationQuery(COMPANY_PAGINATION_CONFIG)
  @Get()
  @CanRead(Resource.COMPANY)
  async find(
    @Paginate() query: PaginateQuery,
    @GetUser() user: AuthenticatedUser,
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

  @Patch('themes')
  @AllowOnly(Role.COMPANY_ADMIN)
  @CanUpdate(Resource.THEME)
  async updateTheme(
    @Body() updateThemeDto: UpdateThemeDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.updateTheme(updateThemeDto);
  }

  @Patch(':id')
  @CanUpdate(Resource.COMPANY)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return await this.companyService.update(+id, updateCompanyDto);
  }

  @ApiBadRequestResponse({
    description: 'Logo upload failed due to validation errors',
  })
  @ApiOkResponse({ description: 'Logo has been uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadCompanyLogoDto })
  @AlsoAllow(Role.COMPANY_ADMIN)
  @CanUpdate(Resource.COMPANY)
  @Patch(':id/logo')
  @UseInterceptors(PhotoFieldInterceptor('logo'))
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile() logo: Express.Multer.File,
    @GetUser() user: AuthenticatedUser,
  ) {
    this.companyService.setUser(user);
    return this.companyService.uploadCompanyLogo(+id, logo);
  }

  @AlsoAllow(Role.COMPANY_ADMIN)
  @CanUpdate(Resource.COMPANY)
  @Delete(':id/logo')
  deleteLogo(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    this.companyService.setUser(user);
    return this.companyService.deleteLogo(+id);
  }

  @Delete('themes')
  @AllowOnly(Role.COMPANY_ADMIN)
  @CanDelete(Resource.THEME)
  deleteTheme(@GetUser() user: AuthenticatedUser) {
    this.companyService.setUser(user);
    return this.companyService.deleteTheme();
  }

  @Delete(':id')
  @CanDelete(Resource.COMPANY)
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
