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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @Get()
  async findAll() {
    return await this.companyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companyService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @Get(':id/sites')
  async findAllCompanySites(@Param('id') id: string) {
    return await this.companyService.findAllCompanySites(+id);
  }
  @Get(':id/security-guards')
  async findAllCompanySecurityGuards(@Param('id') id: string) {
    return await this.companyService.findAllCompanySecurityGuards(+id);
  }
}
