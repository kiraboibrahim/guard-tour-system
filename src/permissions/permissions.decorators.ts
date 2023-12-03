import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import {
  COMPANY_ADMIN_RESOURCE,
  COMPANY_RESOURCE,
  CREATE,
  DELETE,
  PATROL_RESOURCE,
  READ,
  SECURITY_GUARD_RESOURCE,
  SHIFT_RESOURCE,
  SITE_ADMIN_RESOURCE,
  TAG_RESOURCE,
  UPDATE,
} from './permissions';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { User } from '../auth/auth.types';

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

export const GetPaginateQuery = (resource: string) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    switch (resource) {
      case COMPANY_RESOURCE:
        return Paginate();
      case PATROL_RESOURCE:
        return Paginate();
      case SHIFT_RESOURCE:
        return Paginate();
      case TAG_RESOURCE:
        return;
      case COMPANY_ADMIN_RESOURCE:
        return;
      case SITE_ADMIN_RESOURCE:
        return;
      case SECURITY_GUARD_RESOURCE:
        return;
      default:
        return {} as PaginateQuery;
    }
  });
};
