import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { SecurityGuard } from '../entities/security-guard.entity';

export const SECURITY_GUARD_PAGINATION_CONFIG: PaginateConfig<SecurityGuard> = {
  sortableColumns: ['userId', 'user.(firstName)', 'user.(lastName)'],
  defaultSortBy: [['uniqueId', 'DESC']],
  searchableColumns: ['uniqueId', 'user.(firstName)', 'user.(lastName)'],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
    deployedSiteId: [FilterOperator.EQ],
  },
  loadEagerRelations: true,
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
