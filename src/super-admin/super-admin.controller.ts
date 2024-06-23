import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, User } from '../auth/auth.decorators';
import { User as AuthenticatedUser } from '../auth/auth.types';
import {
  CanCreate,
  CanRead,
  CanUpdate,
  CanDelete,
} from '../permissions/permissions.decorators';
import { Resource } from '../permissions/permissions.constants';
import { Role } from '../roles/roles';

@ApiTags('Super Admins')
@Auth(Role.SUPER_ADMIN)
@Controller('users/super-admins')
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}

  @Post()
  @CanCreate(Resource.SUPER_ADMIN)
  create(
    @Body() createSuperAdminDto: CreateSuperAdminDto,
    @User() user: AuthenticatedUser,
  ) {
    this.superAdminService.setUser(user);
    return this.superAdminService.create(createSuperAdminDto);
  }

  @Get()
  @CanRead(Resource.SUPER_ADMIN)
  find() {
    return this.superAdminService.find();
  }

  @Get(':id')
  @CanRead(Resource.SUPER_ADMIN, undefined, { [Resource.SUPER_ADMIN]: 'id' })
  findOne(@Param('id') id: string) {
    return this.superAdminService.findOneById(+id);
  }

  @Patch(':id')
  @CanUpdate(Resource.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSuperAdminDto: UpdateSuperAdminDto,
    @User() user: AuthenticatedUser,
  ) {
    this.superAdminService.setUser(user);
    return await this.superAdminService.update(+id, updateSuperAdminDto);
  }

  @Delete(':id')
  @CanDelete(Resource.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.superAdminService.remove(+id);
  }
}
