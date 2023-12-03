import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { AllowOnly, AlsoAllow } from '../roles/roles.decorators';
import {
  COMPANY_ADMIN_ROLE,
  SITE_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanRead,
  CanUpdate,
} from '../permissions/permissions.decorators';
import { SHIFT_RESOURCE } from '../permissions/permissions';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';

@ApiTags('Shifts')
@AllowOnly(SUPER_ADMIN_ROLE, COMPANY_ADMIN_ROLE)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @CanCreate(SHIFT_RESOURCE)
  create(
    @Body() createShiftDto: CreateShiftDto,
    @User() user: AuthenticatedUser,
  ) {
    this.shiftService.setUser(user);
    return this.shiftService.create(createShiftDto);
  }

  @Get(':id')
  @AlsoAllow(SITE_ADMIN_ROLE)
  @CanRead(SHIFT_RESOURCE)
  findOne(@Param('id') id: string) {
    return this.shiftService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(SHIFT_RESOURCE)
  async update(
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
    @User() user: AuthenticatedUser,
  ) {
    this.shiftService.setUser(user);
    await this.shiftService.update(+id, updateShiftDto);
  }

  @Delete(':id')
  @CanDelete(SHIFT_RESOURCE)
  async remove(@Param('id') id: string) {
    await this.shiftService.remove(+id);
  }
}
