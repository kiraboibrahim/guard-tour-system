import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSiteAdminDto } from '../dto/create-site-admin.dto';
import { UpdateSiteAdminDto } from '../dto/update-site-admin.dto';
import { SiteAdmin } from '../entities/site-admin.entity';
import { UserService } from './user.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SITE_ADMIN_PAGINATION_CONFIG } from '../pagination-config/site-admin-pagination.config';
import { BaseService } from '../../core/core.base';
import { Site } from '../../site/entities/site.entity';

@Injectable()
export class SiteAdminService extends BaseService {
  constructor(
    @InjectRepository(SiteAdmin)
    private siteAdminRepository: Repository<SiteAdmin>,
    private userService: UserService,
  ) {
    super();
  }
  async create(createSiteAdminDto: CreateSiteAdminDto) {
    this.validateSiteAdminDto(createSiteAdminDto);
    return await this.userService.createSiteAdmin(createSiteAdminDto);
  }
  validateSiteAdminDto(dto: CreateSiteAdminDto | UpdateSiteAdminDto) {
    const validateCreateSiteAdminDto = (
      createSiteAdminDto: CreateSiteAdminDto,
    ) => {
      const { site }: { site: Site } = dto as any;
      const { companyId: givenCompanyId } = createSiteAdminDto;
      const { companyId: expectedCompanyId } = this.user;
      const invalidCompanyId = givenCompanyId !== expectedCompanyId;
      if (
        this.user.isCompanyAdmin() &&
        (!site.belongsToCompany(expectedCompanyId) || invalidCompanyId)
      ) {
        throw new UnauthorizedException('Invalid company or site)');
      }
      return true;
    };

    const validateUpdateSiteAdminDto = (dto: UpdateSiteAdminDto) => {
      const { site }: { site: Site } = dto as any;
      const { companyId } = this.user;
      if (!!site && !site.belongsToCompany(companyId))
        throw new UnauthorizedException();
      return true;
    };
    const isCreateSiteAdminDto = dto instanceof CreateSiteAdminDto;
    if (isCreateSiteAdminDto) {
      validateCreateSiteAdminDto(dto);
    } else {
      validateUpdateSiteAdminDto(dto);
    }
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.siteAdminRepository,
      SITE_ADMIN_PAGINATION_CONFIG,
    );
  }

  async findOneById(id: number) {
    return await this.siteAdminRepository.findOneBy({ userId: id });
  }

  async update(id: number, updateSiteAdminDto: UpdateSiteAdminDto) {
    this.validateSiteAdminDto(updateSiteAdminDto);
    return await this.userService.updateSiteAdmin(id, updateSiteAdminDto);
  }

  async remove(id: number) {
    return await this.userService.remove(id);
  }
}
