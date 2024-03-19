import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';
import { Tag } from './entities/tag.entity';

export const TAG_PAGINATION_CONFIG: PaginateConfig<Tag> = {
  searchableColumns: ['uid'],
  sortableColumns: ['uid'],
  filterableColumns: {
    siteId: [FilterOperator.IN, FilterOperator.NULL],
    companyId: [FilterOperator.EQ],
  },
  loadEagerRelations: true,
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
