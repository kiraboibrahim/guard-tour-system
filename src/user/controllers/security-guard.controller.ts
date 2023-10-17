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

@Controller('security-guards')
export class SecurityGuardController {
  constructor(private readonly securityGuardService: SecurityGuardService) {}

  @Post()
  create(@Body() createSecurityGuardDto: CreateSecurityGuardDto) {
    return this.securityGuardService.create(createSecurityGuardDto);
  }

  @Get()
  findAll() {
    return this.securityGuardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityGuardService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSecurityGuardDto: UpdateSecurityGuardDto,
  ) {
    return this.securityGuardService.update(+id, updateSecurityGuardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityGuardService.remove(+id);
  }
  @Get(':id/patrols')
  findSecurityGuardPatrols(@Param('id') id: string) {
    return [];
  }
}
