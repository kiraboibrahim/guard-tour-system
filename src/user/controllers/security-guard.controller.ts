import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SecurityGuardService } from '../services/security-guard.service';
import { CreateSecurityGuardDto } from '../dto/create-security-guard.dto';
import { UpdateSecurityGuardDto } from '../dto/update-security-guard.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiTags } from '@nestjs/swagger';
import { SECURITY_GUARD_PAGINATION_CONFIG } from '../pagination-config/security-guard-pagination.config';
import { Auth, IsPublic, User } from '../../auth/auth.decorators';
import { User as AuthenticatedUser } from '../../auth/auth.types';
import { Role } from '../../roles/roles';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../../permissions/permissions.decorators';
import { Resource } from '../../permissions/permissions';

@ApiTags('Security Guards')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('security-guards')
export class SecurityGuardController {
  constructor(private readonly securityGuardService: SecurityGuardService) {}

  @Post()
  @CanCreate(Resource.SECURITY_GUARD)
  create(
    @Body() createSecurityGuardDto: CreateSecurityGuardDto,
    @User() user: AuthenticatedUser,
  ) {
    this.securityGuardService.setUser(user);
    return this.securityGuardService.create(createSecurityGuardDto);
  }

  @ApiPaginationQuery(SECURITY_GUARD_PAGINATION_CONFIG)
  @Get()
  @CanRead(Resource.SECURITY_GUARD)
  find(@Paginate() query: PaginateQuery, @User() user: AuthenticatedUser) {
    this.securityGuardService.setUser(user);
    return this.securityGuardService.find(query);
  }

  @Get(':id')
  @IsPublic()
  findOne(@Param('id') id: string) {
    return this.securityGuardService.findOneById(id);
  }

  @Patch(':id')
  @CanUpdate(Resource.SECURITY_GUARD)
  async update(
    @Param('id') id: string,
    @Body() updateSecurityGuardDto: UpdateSecurityGuardDto,
    @User() user: AuthenticatedUser,
  ) {
    this.securityGuardService.setUser(user);
    return await this.securityGuardService.update(+id, updateSecurityGuardDto);
  }

  @Delete(':id')
  @CanDelete(Resource.SECURITY_GUARD)
  async remove(@Param('id') id: string) {
    return await this.securityGuardService.remove(+id);
  }

  @Get(':id/patrols')
  @CanRead(Resource.PATROL, [Resource.SECURITY_GUARD], {
    [Resource.SECURITY_GUARD]: 'id',
  }) // This route is public. However, it still verifies permissions when authentication is provided
  // by the user in order to verify if the user is authorized to access privileged actions like filtering on site
  @IsPublic()
  async findSecurityGuardPatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
    @User() user: AuthenticatedUser,
  ) {
    this.securityGuardService.setUser(user);
    return await this.securityGuardService.findSecurityGuardPatrols(id, query);
  }
}
