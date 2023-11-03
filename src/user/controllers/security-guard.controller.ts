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

@ApiTags('Security Guards')
@Controller('security-guards')
export class SecurityGuardController {
  constructor(private readonly securityGuardService: SecurityGuardService) {}

  @Post()
  create(@Body() createSecurityGuardDto: CreateSecurityGuardDto) {
    return this.securityGuardService.create(createSecurityGuardDto);
  }

  @ApiPaginationQuery(SECURITY_GUARD_PAGINATION_CONFIG)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.securityGuardService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityGuardService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSecurityGuardDto: UpdateSecurityGuardDto,
  ) {
    await this.securityGuardService.update(+id, updateSecurityGuardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.securityGuardService.remove(+id);
  }

  @Get(':id/patrols')
  async findSecurityGuardPatrols(
    @Param('id') id: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.securityGuardService.findAllSecurityGuardPatrols(
      +id,
      query,
    );
  }

  @Get(':id/patrol-plan')
  async findSecurityGuardPatrolPlan(@Param('id') id: string) {
    return this.securityGuardService.findSecurityGuardPatrolPlan(+id);
  }
}
