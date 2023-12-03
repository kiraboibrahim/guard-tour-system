import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagsDto } from './dto/create-tags.dto';
import {
  UpdateTagDto,
  UninstallTagsFromSiteDto,
  InstallTagsToSiteDto,
} from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { TAG_PAGINATION_CONFIG } from './tag-pagination.config';
import { BaseService } from '../core/core.base';
import { Company } from '../company/entities/company.entity';
import { Site } from '../site/entities/site.entity';

@Injectable()
export class TagService extends BaseService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {
    super();
  }
  async create(createTagDto: CreateTagsDto) {
    const { UIDs } = createTagDto;
    const { company, site }: { company: Company; site: Site } =
      createTagDto as any;
    const userIsCompanyAdmin = this.user.isCompanyAdmin();
    const userBelongsToCompany = this.user.belongsToCompany(company.id);
    const siteBelongsToCompany = site.belongsToCompany(this.user.companyId);
    const unAuthorizedAction =
      userIsCompanyAdmin && (!userBelongsToCompany || !siteBelongsToCompany);
    if (unAuthorizedAction) throw new UnauthorizedException();
    const toBeCreatedTags = UIDs.map((uid) =>
      this.tagRepository.create({ uid, company, site }),
    );
    return await this.tagRepository.save(toBeCreatedTags);
  }
  async findAll(query: PaginateQuery) {
    return await paginate(query, this.tagRepository, TAG_PAGINATION_CONFIG);
  }

  async findOneById(id: number) {
    return await this.tagRepository.findOneBy({ id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return await this.tagRepository.update({ id }, updateTagDto);
  }
  async installTagsToSite(installTagsToSiteDto: InstallTagsToSiteDto) {
    const { companyId: userCompanyId } = this.user;
    const { tagIDs } = installTagsToSiteDto;
    const { tags, site }: { tags: Tag[]; site: Site } =
      installTagsToSiteDto as any;
    const tagsBelongToUserCompany = () =>
      tags.every((tag) => tag.belongsToCompany(userCompanyId));
    const unAuthorizedAction =
      this.user.isCompanyAdmin() &&
      (!tagsBelongToUserCompany() ||
        !site.belongsToCompany(this.user.companyId));
    if (unAuthorizedAction) return new UnauthorizedException();
    const toBeInstalledTags = tags
      .filter((tag) => tag.siteId === null)
      .map((tag) => {
        tag.siteId = site.id;
        return tag;
      });
    const alreadyInstalledTags = toBeInstalledTags.length !== tagIDs.length;
    if (alreadyInstalledTags) {
      throw new BadRequestException('Some tags are already installed');
    }
    return await this.tagRepository.save(toBeInstalledTags);
  }
  async uninstallTagsFromSite(
    uninstallTagsFromSiteDto: UninstallTagsFromSiteDto,
  ) {
    const { companyId: userCompanyId } = this.user;
    const { tags }: { tags: Tag[] } = uninstallTagsFromSiteDto as any;
    const tagsBelongToUserCompany = () =>
      tags.every((tag) => tag.belongsToCompany(userCompanyId));
    const unAuthorizedAction =
      this.user.isCompanyAdmin() && !tagsBelongToUserCompany();
    if (unAuthorizedAction) return new UnauthorizedException();
    const toBeUninstalledTags = tags.map((tag) => {
      tag.siteId = null;
      return tag;
    });
    return await this.tagRepository.save(toBeUninstalledTags);
  }
  async tagBelongsToCompany(tagId: number, companyId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId, companyId },
    });
    return !!tag;
  }
  async remove(id: number) {
    return await this.tagRepository.delete(id);
  }
}
