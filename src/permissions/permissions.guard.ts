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
import { CREATE, DELETE, READ, UPDATE } from './permissions';
import { User } from '../auth/auth.types';
import { Permission } from './permissions.types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const permission = this.reflector.getAllAndOverride<Permission>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!permission) {
      this.logger.warn(`Specify permissions for route: ${request.url}`);
      return false;
    }
    const user = request.user as User;
    permission.resourceId = request.params?.id;
    return this.userHasPermission(user, permission);
  }
  async userHasPermission(user: User, permission: Permission) {
    const { role } = user;
    const { action, resource, resourceId } = permission;
    switch (action) {
      case CREATE:
        return (
          this.permissionsService.can(role).createAny(resource).granted ||
          this.permissionsService.can(role).createOwn(resource).granted
        );
      case READ:
        const { childResource } = permission;
        const isNestedResource = childResource && resourceId;
        if (isNestedResource)
          return await this.canUserReadNestedResources(
            user,
            resource,
            resourceId,
            childResource,
          );
        return await this.canUserReadResource(user, resource, resourceId);

      case UPDATE:
        return await this.canUserUpdateResource(
          user,
          resource,
          resourceId as string,
        );
      case DELETE:
        return await this.canUserDeleteResource(
          user,
          resource,
          resourceId as string,
        );
      default:
        return false;
    }
  }
  async canUserUpdateResource(
    user: User,
    resource: string,
    resourceId?: string,
  ) {
    const { role } = user;
    const userAccessToResourceGranted = resourceId
      ? await this.permissionsService.userHasAccessToResource(
          user,
          resource,
          resourceId,
        )
      : true; // No resourceId given, default to true and check permissions in the service
    const canUpdateOwn = this.permissionsService
      .can(role)
      .updateOwn(resource).granted;
    const canUpdateAny = this.permissionsService
      .can(role)
      .updateAny(resource).granted;
    return canUpdateAny || (userAccessToResourceGranted && canUpdateOwn);
  }
  async canUserDeleteResource(
    user: User,
    resource: string,
    resourceId?: string,
  ) {
    const userAccessToResourceGranted = resourceId
      ? await this.permissionsService.userHasAccessToResource(
          user,
          resource,
          resourceId,
        )
      : true; // No resourceId given, default to true and check permissions in the service
    const canDeleteOwn = this.permissionsService
      .can(user.role)
      .deleteOwn(resource).granted;
    const canDeleteAny = this.permissionsService
      .can(user.role)
      .deleteAny(resource).granted;
    return canDeleteAny || (userAccessToResourceGranted && canDeleteOwn);
  }

  async canUserReadResource(user: User, resource: string, resourceId?: string) {
    const canReadAny = this.permissionsService
      .can(user.role)
      .readAny(resource).granted;
    const canReadOwn = this.permissionsService
      .can(user.role)
      .readOwn(resource).granted;
    if (resourceId) {
      const userAccessToResourceGranted =
        await this.permissionsService.userHasAccessToResource(
          user,
          resource,
          resourceId,
        );
      return canReadAny || (userAccessToResourceGranted && canReadOwn);
    }
    return canReadAny || canReadOwn;
  }

  async canUserReadNestedResources(
    user: User,
    parentResource: string,
    parentResourceId: string,
    childResource: string,
  ) {
    const canReadParentResource = await this.canUserReadResource(
      user,
      parentResource,
      parentResourceId,
    );
    const canReadChildResource = await this.canUserReadResource(
      user,
      childResource,
    );
    return canReadParentResource && canReadChildResource;
  }
}
