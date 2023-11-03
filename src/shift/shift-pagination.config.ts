import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';
import { Shift } from './entities/shift.entity';

export const SHIFT_PAGINATION_CONFIG: PaginateConfig<Shift> = {
  sortableColumns: ['startTime', 'endTime'],
  defaultSortBy: [['startTime', 'ASC']],
  filterableColumns: {
    siteId: [FilterOperator.EQ],
    startTime: [FilterOperator.GTE],
    endTime: [FilterOperator.LTE],
  },
  loadEagerRelations: true,
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
