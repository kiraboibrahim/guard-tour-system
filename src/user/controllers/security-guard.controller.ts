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
import { AuthRequired, User } from '../../auth/auth.decorators';
import { User as AuthenticatedUser } from '../../auth/auth.types';
import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SUPER_ADMIN_ROLE,
} from '../../roles/roles.constants';
import { AlsoAllow, DisAllow } from '../../roles/roles.decorators';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../../permissions/permissions.decorators';
import {
  PATROL_RESOURCE,
  SECURITY_GUARD_RESOURCE,
} from '../../permissions/permissions';
import { UnDeploySecurityGuardsDto } from '../dto/undeploy-security-guards.dto';

@ApiTags('Security Guards')
@AuthRequired(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@Controller('security-guards')
export class SecurityGuardController {
  constructor(private readonly securityGuardService: SecurityGuardService) {}

  @Post()
  @CanCreate(SECURITY_GUARD_RESOURCE)
  create(
    @Body() createSecurityGuardDto: CreateSecurityGuardDto,
    @User() user: AuthenticatedUser,
  ) {
    this.securityGuardService.setUser(user);
    return this.securityGuardService.create(createSecurityGuardDto);
  }

  @ApiPaginationQuery(SECURITY_GUARD_PAGINATION_CONFIG)
  @Get()
  @DisAllow(COMPANY_ADMIN_ROLE)
  @CanRead(SECURITY_GUARD_RESOURCE)
  findAll(@Paginate() query: PaginateQuery) {
    return this.securityGuardService.findAll(query);
  }

  @Get(':id')
  @AlsoAllow(SECURITY_GUARD_ROLE)
  @CanRead(SECURITY_GUARD_RESOURCE)
  findOne(@Param('id') id: string) {
    return this.securityGuardService.findOneById(+id);
  }

  @Patch('undeploy')
  @CanUpdate(SECURITY_GUARD_RESOURCE)
  async unDeploySecurityGuards(
    @Body() unDeploySecurityGuardsDto: UnDeploySecurityGuardsDto,
    @User() user: AuthenticatedUser,
  ) {
    this.securityGuardService.setUser(user);
    await this.securityGuardService.unDeploySecurityGuards(
      unDeploySecurityGuardsDto,
    );
  }

  @Patch(':id')
  @CanUpdate(SECURITY_GUARD_RESOURCE)
  async update(
    @Param('id') id: string,
    @Body() updateSecurityGuardDto: UpdateSecurityGuardDto,
    @User() user: AuthenticatedUser,
  ) {
    this.securityGuardService.setUser(user);
    await this.securityGuardService.update(+id, updateSecurityGuardDto);
  }

  @Delete(':id')
  @CanDelete(SECURITY_GUARD_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.securityGuardService.remove(+id);
  }

  @Get(':id/patrols')
  @AlsoAllow(SECURITY_GUARD_ROLE)
  @CanRead(SECURITY_GUARD_RESOURCE, PATROL_RESOURCE)
  async findAllSecurityGuardPatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.securityGuardService.findAllSecurityGuardPatrols(
      +id,
      query,
    );
  }
}
