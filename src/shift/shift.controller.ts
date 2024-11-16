import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Auth, IsPublic, GetUser } from '@auth/auth.decorators';
import { Role } from '@roles/roles.constants';
import {
  CanCreate,
  CanDelete,
  CanUpdate,
} from '@permissions/permissions.decorators';
import { Resource } from '@core/core.constants';
import { User } from '@auth/auth.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shifts')
@Auth(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @CanCreate(Resource.SHIFT)
  @Post()
  create(@Body() createShiftDto: CreateShiftDto, @GetUser() user: User) {
    this.shiftService.setUser(user);
    return this.shiftService.create(createShiftDto);
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(+id);
  }

  @CanUpdate(Resource.SHIFT)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
    @GetUser() user: User,
  ) {
    this.shiftService.setUser(user);
    return this.shiftService.update(+id, updateShiftDto);
  }

  @CanDelete(Resource.SHIFT)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    this.shiftService.setUser(user);
    return this.shiftService.remove(+id);
  }
}
