import { PaginateConfig, PaginationType } from 'nestjs-paginate';
import { CallLog } from './entities/call-log.entity';
import { MAX_ITEMS_PER_PAGE } from '@core/core.constants';

const CALL_LOG_PAGINATION_CONFIG: PaginateConfig<CallLog> = {
  sortableColumns: ['date', 'time'],
  defaultSortBy: [
    ['date', 'DESC'],
    ['time', 'DESC'],
  ],
  searchableColumns: ['site.(name)'],
  relations: { site: true, answeredBy: { user: true } },
  maxLimit: 0,
  defaultLimit: MAX_ITEMS_PER_PAGE,
  paginationType: PaginationType.TAKE_AND_SKIP,
};
export default CALL_LOG_PAGINATION_CONFIG;

export const SITE_CALL_LOGS_PAGINATION_CONFIG = (
  siteId: number,
): PaginateConfig<CallLog> => {
  return { ...CALL_LOG_PAGINATION_CONFIG, where: { site: { id: siteId } } };
};
