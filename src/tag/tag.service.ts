import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagsDto } from './dto/create-tags.dto';
import { UpdateTagUIDDto } from './dto/update-tag-uid.dto';
import { Tag } from './entities/tag.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { TAG_PAGINATION_CONFIG } from './tag.pagination';
import { BaseService } from '../core/services/base.service';
import { Company } from '../company/entities/company.entity';
import { Site } from '../site/entities/site.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { Resource } from '../permissions/permissions.constants';
import { INSTALL_TAGS_ACTION, UNINSTALL_TAGS_ACTION } from './tag.constants';
import { TagsActionDto } from './dto/tags-action.dto';
import { MAX_TAGS_PER_SITE } from '../site/site.constants';

@Injectable()
export class TagService extends BaseService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private permissionsService: PermissionsService,
  ) {
    super();
  }
  async create(createTagsDto: CreateTagsDto) {
    await this.permissionsService
      .can(this.user)
      .create(Resource.TAG, createTagsDto, { throwError: true });

    const { UIDs } = createTagsDto;
    const { company, site }: { company: Company; site: Site } =
      createTagsDto as any;
    if (!!site) {
      this.validateSite(site);
    }
    const toBeCreatedTags = UIDs.map((uid) =>
      this.tagRepository.create({ uid, company, site }),
    );
    return await this.tagRepository.save(toBeCreatedTags);
  }
  async find(query: PaginateQuery) {
    await this.permissionsService
      .can(this.user)
      .filter(Resource.TAG)
      .with(query);
    // Don't raise error incase one filters on company that they don't belong to
    this.applyFilters(query);
    return await paginate(query, this.tagRepository, TAG_PAGINATION_CONFIG);
  }

  async updateTagUID(id: number, updateTagUIDDto: UpdateTagUIDDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.TAG, id, updateTagUIDDto, { throwError: true });
    const { UID } = updateTagUIDDto;
    return await this.tagRepository.update({ id }, { uid: UID });
  }

  async handleTagsActions(tagsActionDto: TagsActionDto) {
    const { type } = tagsActionDto;
    switch (type) {
      case INSTALL_TAGS_ACTION:
        return await this.installTags(tagsActionDto);
      case UNINSTALL_TAGS_ACTION:
        return await this.uninstallTags(tagsActionDto);
    }
  }
  async installTags(installTagsDto: TagsActionDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.TAG, undefined, installTagsDto, { throwError: true });

    const { tagIds } = installTagsDto;
    const { tags, site }: { tags: Tag[]; site: Site } = installTagsDto as any;
    this.validateSite(site);

    const toBeInstalledTags = tags
      .filter((tag) => tag.siteId === null)
      .map((tag) => {
        tag.siteId = site.id;
        return tag;
      });
    const alreadyInstalled = toBeInstalledTags.length !== tagIds.length;
    if (alreadyInstalled) {
      throw new BadRequestException(
        'Some tags are already installed. Uninstall them before reinstalling them',
      );
    }
    return await this.tagRepository.save(toBeInstalledTags);
  }

  private validateSite(site: Site) {
    const maxSiteTagsReached = site.tags.length === MAX_TAGS_PER_SITE;
    if (maxSiteTagsReached) {
      throw new BadRequestException(
        `The site has a maximum number of tags: ${MAX_TAGS_PER_SITE}`,
      );
    }
  }

  async uninstallTags(uninstallTagsDto: TagsActionDto) {
    await this.permissionsService
      .can(this.user)
      .update(Resource.TAG, undefined, uninstallTagsDto, { throwError: true });

    const { tags }: { tags: Tag[] } = uninstallTagsDto as any;
    const toBeUninstalledTags = tags.map((tag) => {
      tag.siteId = null;
      return tag;
    });
    return await this.tagRepository.save(toBeUninstalledTags);
  }

  async remove(id: number) {
    return await this.tagRepository.delete(id);
  }
}
