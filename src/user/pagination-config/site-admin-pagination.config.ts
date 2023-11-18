import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { SiteAdmin } from '../entities/site-admin.entity';

export const SITE_ADMIN_PAGINATION_CONFIG: PaginateConfig<SiteAdmin> = {
  sortableColumns: ['userId', 'user.(firstName)', 'user.(lastName)'],
  defaultSortBy: [['userId', 'ASC']],
  searchableColumns: ['user.(firstName)', 'user.(lastName)'],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
    siteId: [FilterOperator.EQ],
  },
  relations: { user: true },
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
