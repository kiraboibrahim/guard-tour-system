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
  /*
  Allow the user to use the shortcut @CanRead(<resource to read>) since the other parameters are optional
  However the accessing <resource to read> requires knowledge of the route parameter used for the ID which
  by default has been taken to be 'id'. When the resourcesParams is undefined or the <resource to read> is
  missing an entry in the resourcesParams(undefined) and the parentResources is also undefined, then a shortcut
  is being used by the user.
  */
  if (
    (resourcesParams === undefined ||
      resourcesParams[resource] === undefined) &&
    parentResources === undefined
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
