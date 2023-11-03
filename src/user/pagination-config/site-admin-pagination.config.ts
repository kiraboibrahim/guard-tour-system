import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { SiteAdmin } from '../entities/site-admin.entity';

export const SITE_ADMIN_PAGINATION_CONFIG: PaginateConfig<SiteAdmin> = {
  sortableColumns: ['userId', 'firstName', 'lastName'],
  defaultSortBy: [['userId', 'ASC']],
  searchableColumns: ['firstName', 'lastName'],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
    siteId: [FilterOperator.EQ],
  },
  loadEagerRelations: true,
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
