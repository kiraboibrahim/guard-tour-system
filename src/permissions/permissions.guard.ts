import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSIONS_KEY } from './permissions.decorators';
import { PermissionsService } from './permissions.service';
import { Action, Resource } from './permissions';
import { User } from '../auth/auth.types';
import { Permission, ResourcesParams } from './permissions.types';
import { IsPublicMixin } from '../auth/auth.mixins';
import { applyMixins } from '../core/core.utils';

@Injectable()
export class PermissionsGuard implements CanActivate, IsPublicMixin {
  private request: any;
  private readonly logger = new Logger(PermissionsGuard.name);
  isPublic: (reflector: Reflector, context: ExecutionContext) => boolean;

  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.isPublic(this.reflector, context);
    if (isPublic) return true;

    this.request = context.switchToHttp().getRequest();
    const permission = this.reflector.getAllAndOverride<Permission>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    this.permissionsService.setRequest(this.request);
    const user = this.request.user as User;
    const routeHasNoPermissions = !permission;
    if (routeHasNoPermissions) {
      this.logPermissionErrors(user, 'UNDEFINED_ROUTE_PERMISSIONS');
      return false;
    }
    const permissionGranted = this.userHasPermission(user, permission);
    if (!permissionGranted) {
      this.logPermissionErrors(user, 'FORBIDDEN_ACTION');
    }
    return permissionGranted;
  }

  private logPermissionErrors(
    user: User,
    type: 'UNDEFINED_ROUTE_PERMISSIONS' | 'FORBIDDEN_ACTION',
  ) {
    switch (type) {
      case 'UNDEFINED_ROUTE_PERMISSIONS':
        const errorMsg = `Access to route(${this.request.method} ${this.request.url}) has been denied because of the absence of permissions on the route and yet it's being accessed with authentication(access token). If it is a public route, mark it with the @IsPublic() decorator`;
        this.logger.warn(errorMsg);
        break;
      case 'FORBIDDEN_ACTION':
        this.logger.fatal(
          `Access denied to user, User ID: ${user.id}(${user.fullName}) when accessing ${this.request.method} ${this.request.url}`,
        );
        break;
    }
  }

  async userHasPermission(user: User, permission: Permission) {
    const { action } = permission;
    switch (action) {
      case Action.CREATE:
        return this.handleCreatePermissions(user, permission);
      case Action.READ:
        return await this.handleReadPermissions(user, permission);
      case Action.UPDATE:
        return this.handleUpdatePermissions(user, permission);
      case Action.DELETE:
        return await this.handleDeletePermissions(user, permission);
      default:
        return false;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleCreatePermissions(user: User, permission: Permission) {
    // Check CREATE permissions with in services because it requires access to the DTOs used
    // and yet, they can only be optimally accessed(without too many db queries) with in services
    // without introducing in performance bottlenecks i.e. Revalidation of data twice in both the
    // guard and the services
    return true;
  }

  private handleReadPermissions(user: User, permission: Permission) {
    const { resource, parentResources, resourcesParams } = permission;
    const resourceId = resourcesParams
      ? this.getResourceId(resource, resourcesParams)
      : undefined;
    const parentResourcesIds = parentResources
      ? this.getResourcesIds(
          parentResources as Resource[],
          resourcesParams as ResourcesParams,
        )
      : undefined;
    const resources = parentResources
      ? [resource, ...parentResources]
      : [resource];
    const resourcesIds = parentResourcesIds
      ? { [resource]: resourceId, ...parentResourcesIds }
      : { [resource]: resourceId };
    return this.canUserReadResources(user, resources, resourcesIds);
  }
  /**
   * Verifies if a user can read a resource. The REST API supports nesting resources
   * e.g. users/:userId/groups/:groupId/messages/:messageId. This method also verifies
   * reading access for such scenarios by verifying READ permissions on all the parent
   * resources i.e. users, groups in addition to the desired resource i.e. messages
   *
   * ResourcesParams is a type that has keys of all resources mapping them to a string.
   * In the method definition below, we are using this type for resourceIds because
   * they also follow the same structure i.e. {Resource.SITE: '21', ...}, the value is the
   * site ID
   *
   */
  async canUserReadResources(
    user: User,
    resources: Resource[],
    resourcesIds: ResourcesParams,
  ): Promise<boolean> {
    async function _canUserReadResources(
      user: User,
      resources: Resource[],
      resourcesIds: ResourcesParams,
      _this: PermissionsGuard,
    ): Promise<boolean> {
      if (resources.length === 0) return true;
      const resource = resources[0];
      let resourceId = resourcesIds[resource] as any;
      // Cast resourceId from string|undefined to number|undefined as expected by the permissionsService
      resourceId = resourceId !== undefined ? +resourceId : undefined;
      return (
        (await _this.permissionsService.can(user).read(resource, resourceId)) &&
        (await _canUserReadResources(
          user,
          resources.slice(1),
          resourcesIds,
          _this,
        ))
      );
    }

    return await _canUserReadResources(
      user,
      resources as Resource[],
      resourcesIds as ResourcesParams,
      this,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleUpdatePermissions(user: User, permission: Permission) {
    // Verifying update permissions requires access to the DTOs used for update which can
    // only be optimally accessed and checked from within the services, In order not to
    // end the request, pass(return true) and check permissions from within the services
    return true;
  }

  private async handleDeletePermissions(user: User, permission: Permission) {
    const { resource, resourcesParams } = permission;
    const resourceId = !!resourcesParams
      ? this.getResourceId(resource, resourcesParams)
      : undefined;
    return await this.canUserDeleteResource(
      user,
      resource,
      resourceId as number,
    );
  }

  async canUserDeleteResource(
    user: User,
    resource: Resource,
    resourceId: number,
  ) {
    return await this.permissionsService.can(user).delete(resource, resourceId);
  }

  private getResourcesIds(
    resources: Resource[],
    resourcesParams: ResourcesParams,
  ) {
    let resourcesIds = {} as ResourcesParams;
    resources.forEach((resource) => {
      const resourceId = this.getResourceId(resource, resourcesParams);
      resourcesIds = { ...resourcesIds, [resource]: resourceId };
    });
    return resourcesIds;
  }
  private getResourceId(resource: Resource, resourcesParams: ResourcesParams) {
    const resourceParam = resourcesParams[resource] as string;
    return this.request.params[resourceParam];
  }
}
applyMixins(PermissionsGuard, IsPublicMixin);
