export const CREATE = 'create';
export const READ = 'read';
export const UPDATE = 'update';
export const DELETE = 'delete';

const SUPER_ADMIN_PERMISSIONS = {
  COMPANY_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  DEVICE_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  SITE_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  COMPANY_ADMIN_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  SITE_ADMIN_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  SECURITY_GUARD_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  SHIFT_RESOURCE: {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*'],
  },
  PATROL_RESOURCE: {
    'read:any': ['*'],
  },
};

const COMPANY_ADMIN_PERMISSIONS = {
  DEVICE_RESOURCE: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*'],
    'delete:own': ['*'],
  },
  SITE_RESOURCE: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  SITE_ADMIN_RESOURCE: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  SECURITY_GUARD_RESOURCE: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', '!company', '!companyId'],
    'delete:own': ['*'],
  },
  SHIFT_RESOURCE: {
    'create:own': ['*'],
    'read:own': ['*'],
    'update:own': ['*', 'shift', '!shiftId'],
    'delete:own': ['*'],
  },
  PATROL_RESOURCE: {
    'read:own': ['*'],
  },
};

const SITE_ADMIN_PERMISSIONS = {
  PATROL_RESOURCE: {
    'read:own': ['*'],
  },
  SHIFT_RESOURCE: {
    'read:own': ['*'],
  },
  DEVICE_RESOURCE: {
    'read:own': ['*'],
  },
};

const SECURITY_GUARD_PERMISSIONS = {
  SHIFT_RESOURCE: {
    'read:own': ['*'],
  },
  PATROL_RESOURCE: {
    'create:own': ['*'],
    'read:own': ['*'],
  },
};

const PERMISSIONS = {
  SUPER_ADMIN_ROLE: SUPER_ADMIN_PERMISSIONS,
  COMPANY_ADMIN_ROLE: COMPANY_ADMIN_PERMISSIONS,
  SITE_ADMIN_ROLE: SITE_ADMIN_PERMISSIONS,
  SECURITY_GUARD_ROLE: SECURITY_GUARD_PERMISSIONS,
};

export default PERMISSIONS;
