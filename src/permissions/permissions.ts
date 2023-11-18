import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SITE_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../roles/roles.constants';

export const CREATE = 'CREATE';
export const READ = 'READ';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';

export const COMPANY_RESOURCE = 'COMPANY_RESOURCE';

export const TAG_RESOURCE = 'TAG_RESOURCE';

export const SITE_RESOURCE = 'SITE_RESOURCE';

export const SHIFT_RESOURCE = 'SHIFT_RESOURCE';

export const PATROL_RESOURCE = 'PATROL_RESOURCE';

export const PATROL_PLAN_RESOURCE = 'PATROL_PLAN_RESOURCE';
export const SUPER_ADMIN_RESOURCE = 'SUPER_ADMIN_RESOURCE';

export const COMPANY_ADMIN_RESOURCE = 'COMPANY_ADMIN_RESOURCE';

export const SITE_ADMIN_RESOURCE = 'SITE_ADMIN_RESOURCE';

export const SECURITY_GUARD_RESOURCE = 'SECURITY_GUARD_RESOURCE';

const SUPER_ADMIN_PERMISSIONS = {
  [COMPANY_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [TAG_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [SITE_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [SUPER_ADMIN_RESOURCE]: {
    'read:own': ['*'],
    'update:own': ['*'],
  },
  [COMPANY_ADMIN_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [SITE_ADMIN_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [SECURITY_GUARD_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [SHIFT_RESOURCE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [PATROL_RESOURCE]: {
    'read:any': ['*'],
  },
};

const COMPANY_ADMIN_PERMISSIONS = {
  [COMPANY_RESOURCE]: {
    'read:own': ['*'],
  },
  [TAG_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*'],
    'delete:own': ['*'],
  },
  [SITE_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  [COMPANY_ADMIN_RESOURCE]: {
    'read:own': ['*'],
  },
  [SITE_ADMIN_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  [SECURITY_GUARD_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  [SHIFT_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', 'shift', '!shiftId'],
    'delete:own': ['*'],
  },
  [PATROL_PLAN_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*'],
    'delete:own': ['*'],
  },
  [PATROL_RESOURCE]: {
    'read:own': ['*'],
  },
};

const SITE_ADMIN_PERMISSIONS = {
  [SITE_ADMIN_RESOURCE]: {
    'read:own': ['*'],
  },
  [PATROL_RESOURCE]: {
    'read:own': ['*'],
  },
  [SHIFT_RESOURCE]: {
    'read:own': ['*'],
  },
  [TAG_RESOURCE]: {
    'read:own': ['*'],
  },
};

const SECURITY_GUARD_PERMISSIONS = {
  [SECURITY_GUARD_RESOURCE]: {
    'read:own': ['*'],
  },
  [SITE_RESOURCE]: {
    'read:own': ['*'],
  },
  [SHIFT_RESOURCE]: {
    'read:own': ['*'],
  },
  [PATROL_RESOURCE]: {
    'create:own': ['*'],
    'read:own': ['*'],
  },
  [PATROL_PLAN_RESOURCE]: {
    'read:own': ['*'],
  },
};

const PERMISSIONS = {
  [SUPER_ADMIN_ROLE]: SUPER_ADMIN_PERMISSIONS,
  [COMPANY_ADMIN_ROLE]: COMPANY_ADMIN_PERMISSIONS,
  [SITE_ADMIN_ROLE]: SITE_ADMIN_PERMISSIONS,
  [SECURITY_GUARD_ROLE]: SECURITY_GUARD_PERMISSIONS,
};

export default PERMISSIONS;
