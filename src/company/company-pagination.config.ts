import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { Company } from './entities/company.entity';
import { MAX_ITEMS_PER_PAGE } from '../core/core.constants';

export const COMPANY_PAGINATION_CONFIG: PaginateConfig<Company> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['name', 'DESC']],
  searchableColumns: ['name', 'registrationNumber'],
  maxLimit: 0,
  defaultLimit: MAX_ITEMS_PER_PAGE,
  loadEagerRelations: true,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
