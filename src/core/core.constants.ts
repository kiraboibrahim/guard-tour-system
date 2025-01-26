export const MAX_ITEMS_PER_PAGE = 20;
export const MTN_UG_REGEX = /\+?256(?:76|77|78|31|39)[0-9]{7}$/;
export const AIRTEL_UG_REGEX = /\+?256(?:70|74|75|20)[0-9]{7}$/;
export const LYCA_UG_REGEX = /\+?25672[0-9]{7}$/;
export const LOCALHOST_REGEX = /^localhost(:?[0-9]+)?$/i;

export const MAX_PHOTO_SIZE = 2.5 * 1024 * 1024; // 2.5 MBs

export enum Resource {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY = 'COMPANY',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  SITE_ADMIN = 'SITE_ADMIN',
  SECURITY_GUARD = 'SECURITY_GUARD',
  SITE = 'SITE',
  SHIFT = 'SHIFT',
  TAG = 'TAG',
  SITE_OWNER = 'SITE_OWNER',
  PATROL = 'PATROL',
  NOTIFICATION = 'NOTIFICATION',
  THEME = 'THEME',
  STATS = 'STATISTICS',
}
