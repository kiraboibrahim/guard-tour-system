import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RequiredPermission } from './permissions.decorators';
import { PermissionsService } from './permissions.service';
import { CREATE, DELETE, READ, UPDATE } from './permissions.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [action, resource] = this.reflector.getAllAndOverride(
      RequiredPermission,
      [context.getHandler(), context.getClass()],
    );
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    switch (action) {
      case CREATE:
        return (
          this.permissionsService.can(user.role).createAny(resource).granted ||
          this.permissionsService.can(user.role).createOwn(resource).granted
        );
      case READ:
        return (
          this.permissionsService.can(user.role).readAny(resource).granted ||
          this.permissionsService.can(user.role).readOwn(resource).granted
        );
      case UPDATE:
        return (
          this.permissionsService.can(user.role).updateAny(resource).granted ||
          this.permissionsService.can(user.role).updateOwn(resource).granted
        );
      case DELETE:
        return (
          this.permissionsService.can(user.role).deleteAny(resource).granted ||
          this.permissionsService.can(user.role).deleteOwn(resource).granted
        );
      default:
        throw new UnauthorizedException();
    }
  }
}
