import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '@core/core.constants';
import { Site } from '../entities/site.entity';

export const SITE_PAGINATION_CONFIG: PaginateConfig<Site> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['name', 'DESC']],
  searchableColumns: ['name', 'tagId'],
  filterableColumns: {
    companyId: [FilterOperator.EQ],
    ownerUserId: [FilterOperator.EQ, FilterOperator.NULL],
    notificationCycle: [FilterOperator.EQ],
    requiredPatrolsPerGuard: [FilterOperator.NULL],
  },
  loadEagerRelations: false,
  relations: {
    admin: {
      user: true,
      site: false,
    },
    owner: {
      user: true,
    },
    company: true,
    tags: true,
    latestPatrol: { securityGuard: { user: true } },
  },
  maxLimit: 0,
  defaultLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
