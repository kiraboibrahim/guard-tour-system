import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';
import { Device } from './entities/device.entity';

export const DEVICE_PAGINATION_CONFIG: PaginateConfig<Device> = {
  sortableColumns: ['serialNumber'],
  defaultSortBy: [['serialNumber', 'ASC']],
  filterableColumns: {
    siteId: [FilterOperator.EQ],
  },
  searchableColumns: ['partNumber', 'IMEI', 'simId', 'phoneNumber'],
  loadEagerRelations: true,
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
