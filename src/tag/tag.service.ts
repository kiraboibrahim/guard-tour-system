import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { TAG_PAGINATION_CONFIG } from './tag-pagination.config';
import { BaseService } from '../core/core.base';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class TagService extends BaseService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {
    super();
  }
  async create(createTagDto: CreateTagDto) {
    const { uid } = createTagDto;
    const { company }: { company: Company } = createTagDto as any;
    const userIsCompanyAdmin = this.user.isCompanyAdmin();
    const userBelongsToCompany = this.user.belongsToCompany(company.id);
    const rejectTagCreation = userIsCompanyAdmin && !userBelongsToCompany;
    if (rejectTagCreation) throw new UnauthorizedException('Invalid company');
    const tag = this.tagRepository.create({
      uid,
      company,
    });
    return await this.tagRepository.save(tag);
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
