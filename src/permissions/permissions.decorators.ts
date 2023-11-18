import { SetMetadata } from '@nestjs/common';
import { CREATE, DELETE, READ, UPDATE } from './permissions';

export const REQUIRED_PERMISSIONS_KEY = 'requiredPermission';

export const CanCreate = (resource: string) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, { action: CREATE, resource });

export const CanRead = (resource: string, childResource?: string) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    action: READ,
    resource,
    childResource,
  });

export const CanUpdate = (resource: string) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, { action: UPDATE, resource });

export const CanDelete = (resource: string) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, { action: DELETE, resource });
