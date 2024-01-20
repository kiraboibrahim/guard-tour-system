import { SetMetadata } from '@nestjs/common';
import { Action } from './permissions';
import { ResourcesParams } from './permissions.types';
import { Resource } from './permissions';

export const REQUIRED_PERMISSIONS_KEY = 'REQUIRED_PERMISSIONS';

export const CanCreate = (resource: Resource) => {
  return SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    action: Action.CREATE,
    resource,
  });
};

export const CanRead = (
  resource: string,
  parentResources?: Resource[],
  resourcesParams?: ResourcesParams,
) => {
  return SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    action: Action.READ,
    resource,
    parentResources,
    resourcesParams,
  });
};

export const CanUpdate = (resource: Resource, resourceParam = 'id') => {
  return SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    action: Action.UPDATE,
    resource,
    resourcesParams: { [resource]: resourceParam },
  });
};

export const CanDelete = (resource: Resource, resourceParam = 'id') => {
  return SetMetadata(REQUIRED_PERMISSIONS_KEY, {
    action: Action.DELETE,
    resource,
    resourcesParams: { [resource]: resourceParam },
  });
};
