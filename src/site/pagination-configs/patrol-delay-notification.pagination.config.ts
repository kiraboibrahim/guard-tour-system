import {
  FilterOperator,
  PaginateConfig,
  PaginationType,
} from 'nestjs-paginate';
import { MAX_ITEMS_PER_PAGE } from '../../core/core.constants';
import { PatrolDelayNotification } from '../entities/patrol-delay-notification.entity';

export const PATROL_DELAY_NOTIFICATION_PAGINATION_CONFIG: PaginateConfig<PatrolDelayNotification> =
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
