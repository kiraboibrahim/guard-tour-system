import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';
import { Patrol } from './entities/patrol.entity';

export const PATROL_PAGINATION_CONFIG: PaginateConfig<Patrol> = {
  sortableColumns: ['date'],
  defaultSortBy: [['date', 'DESC']],
  filterableColumns: {
    date: [FilterOperator.EQ],
    siteId: [FilterOperator.EQ],
  },
  loadEagerRelations: true,
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
