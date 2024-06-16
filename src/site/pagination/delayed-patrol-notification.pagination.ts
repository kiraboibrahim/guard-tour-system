import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { DelayedPatrolNotification } from '../entities/delayed-patrol-notification.entity';

export const DELAYED_PATROL_NOTIFICATION_PAGINATION_CONFIG: PaginateConfig<DelayedPatrolNotification> =
  {
    sortableColumns: ['dateCreatedAt', 'timeCreatedAt'],
    defaultSortBy: [
      ['dateCreatedAt', 'DESC'],
      ['timeCreatedAt', 'DESC'],
    ],
    filterableColumns: {
      dateCreatedAt: [
        FilterOperator.EQ,
        FilterOperator.BTW,
        FilterOperator.LTE,
        FilterOperator.GTE,
      ],
      siteId: [FilterOperator.EQ],
    },
    loadEagerRelations: true,
    maxLimit: 0,
    defaultLimit: MAX_ITEMS_PER_PAGE,
    paginationType: PaginationType.TAKE_AND_SKIP,
  };
