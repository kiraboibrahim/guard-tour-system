import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { CompanyAdmin } from '../entities/company-admin.entity';

export const COMPANY_ADMIN_PAGINATION_CONFIG: PaginateConfig<CompanyAdmin> = {
  sortableColumns: ['userId', 'user.(firstName)', 'user.(lastName)'],
  defaultSortBy: [['userId', 'ASC']],
  searchableColumns: ['user.(firstName)', 'user.(lastName)'],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
  },
  relations: { user: true },
  maxLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
