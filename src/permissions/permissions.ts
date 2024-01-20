export enum Action {
  CREATE = 'CREATE_ACTION',
  READ = 'READ_ACTION',
  UPDATE = 'UPDATE_ACTION',
  DELETE = 'DELETE_ACTION',
}

export enum Resource {
  SUPER_ADMIN = 'SUPER_ADMIN_RESOURCE',
  COMPANY = 'COMPANY_RESOURCE',
  COMPANY_ADMIN = 'COMPANY_ADMIN_RESOURCE',
  SITE_ADMIN = 'SITE_ADMIN_RESOURCE',
  SECURITY_GUARD = 'SECURITY_GUARD_RESOURCE',
  SITE = 'SITE_RESOURCE',
  TAG = 'TAG_RESOURCE',
  SHIFT = 'SHIFT_RESOURCE',
  PATROL = 'PATROL_RESOURCE',
}

/*
const SUPER_ADMIN_PERMISSIONS = {
  [Resource.COMPANY]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.TAG]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.SITE]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.SUPER_ADMIN]: {
    'read:own': ['*'],
    'update:own': ['*'],
  },
  [Resource.COMPANY_ADMIN]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.SITE_ADMIN]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.SECURITY_GUARD]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.SHIFT]: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  [Resource.PATROL]: {
    'read:any': ['*'],
  },
};

const COMPANY_ADMIN_PERMISSIONS = {
  [Resource.COMPANY]: {
    'read:own': ['*'],
  },
  [Resource.TAG]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*'],
    'delete:own': ['*'],
  },
  [Resource.SITE]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  [Resource.COMPANY_ADMIN]: {
    'read:own': ['*'],
  },
  [Resource.SITE_ADMIN]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  [Resource.SECURITY_GUARD]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  [Resource.SHIFT]: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', 'shift', '!shiftId'],
    'delete:own': ['*'],
  },
  [Resource.PATROL]: {
    'read:own': ['*'],
  },
};

const SITE_ADMIN_PERMISSIONS = {
  [Resource.COMPANY]: {
    'read:own': ['*'],
  },

  [Resource.SITE_ADMIN]: {
    'read:own': ['*'],
  },
  [Resource.SITE]: {
    'read:own': ['*'],
  },
  [Resource.PATROL]: {
    'read:own': ['*'],
  },
  [Resource.SHIFT]: {
    'read:own': ['*'],
  },
  [Resource.TAG]: {
    'read:own': ['*'],
  },
};

const SECURITY_GUARD_PERMISSIONS = {
  [Resource.COMPANY]: {
    'read:own': ['*'],
  },
  [Resource.SECURITY_GUARD]: {
    'read:own': ['*'],
  },
  [Resource.SITE]: {
    'read:own': ['*'],
  },
  [Resource.SHIFT]: {
    'read:own': ['*'],
  },
  [Resource.PATROL]: {
    'create:own': ['*'],
    'read:own': ['*'],
  },
  [Resource.TAG]: {
    'read:own': ['*'],
  },
};

const PERMISSIONS = {
  [Role.SUPER_ADMIN]: SUPER_ADMIN_PERMISSIONS,
  [Role.COMPANY_ADMIN]: COMPANY_ADMIN_PERMISSIONS,
  [Role.SITE_ADMIN]: SITE_ADMIN_PERMISSIONS,
  [Role.SECURITY_GUARD]: SECURITY_GUARD_PERMISSIONS,
};

export default PERMISSIONS;
*/
