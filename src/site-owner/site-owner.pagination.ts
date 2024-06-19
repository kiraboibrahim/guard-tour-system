import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';
import { SiteOwner } from './entities/site-owner.entity';

export const SITE_OWNER_PAGINATION_CONFIG: PaginateConfig<SiteOwner> = {
  sortableColumns: ['userId', 'user.(firstName)', 'user.(lastName)'],
  defaultSortBy: [['userId', 'ASC']],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
  },
  searchableColumns: ['user.(firstName)', 'user.(lastName)'],
  maxLimit: 0,
  defaultLimit: MAX_ITEMS_PER_PAGE,
  relations: { user: true },
  paginationType: PaginationType.TAKE_AND_SKIP,
};
