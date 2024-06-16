import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { Site } from '../entities/site.entity';

export const SITE_PAGINATION_CONFIG: PaginateConfig<Site> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['name', 'DESC']],
  searchableColumns: ['name', 'tagId'],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
    notificationCycle: [FilterOperator.EQ],
    requiredPatrolsPerGuard: [FilterOperator.NULL],
  },
  loadEagerRelations: true,
  maxLimit: 0,
  defaultLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
