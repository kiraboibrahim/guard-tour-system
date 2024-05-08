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

/**
 *
 * @param resource The eventual resource that will be read
 * @param parentResources The parent resource to which the resource belongs
 * @param resourcesParams A mapping of resource names to the parameter names used in the route. This allows us to extract route params
 * @constructor
 */
export const CanRead = (
  resource: Resource,
  parentResources?: Resource[],
  resourcesParams?: ResourcesParams,
) => {
  // When resourcesParams hasn't been given or when the resource to be read(Not the parent resources) doesn't
  // exist with in the resourcesParams, then go ahead and apply the default ':id' param for the resource
  if (
    resourcesParams === undefined ||
    resourcesParams[resource] === undefined
  ) {
    resourcesParams = { [resource]: 'id' };
  }
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
