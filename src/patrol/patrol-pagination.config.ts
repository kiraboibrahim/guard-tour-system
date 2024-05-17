import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';
import { Patrol } from './entities/patrol.entity';

export const PATROL_PAGINATION_CONFIG: PaginateConfig<Patrol> = {
  sortableColumns: ['date', 'startTime'],
  defaultSortBy: [
    ['date', 'DESC'],
    ['startTime', 'DESC'],
  ],
  filterableColumns: {
    date: [
      FilterOperator.EQ,
      FilterOperator.BTW,
      FilterOperator.GTE,
      FilterOperator.LTE,
    ],
    startTime: [
      FilterOperator.EQ,
      FilterOperator.BTW,
      FilterOperator.GTE,
      FilterOperator.LTE,
    ],
    siteId: [FilterOperator.IN],
  },
  relations: { securityGuard: { user: true }, site: true },
  maxLimit: 0,
  defaultLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
