import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  DISALLOWED_ROLES_KEY,
  PRIMARY_ROLES_KEY,
  SECONDARY_ROLES_KEY,
} from './roles.decorators';
import { Role } from './roles.types';
import { User } from '../auth/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const primaryRoles = this.getPrimaryRoles(context);
    if (!primaryRoles.size) {
      return false;
    }
    const secondaryRoles = this.getSecondaryRoles(context);
    const disallowedRoles = this.getDisallowedRoles(context);
    const diff = function <T>(A: T[], B: T[]) {
      return A.filter(function (elem: T) {
        return B.indexOf(elem) < 0;
      });
    };
    const primaryAndSecondaryRoles = [...primaryRoles, ...secondaryRoles];
    const effectiveRoles = new Set(
      diff<Role>([...primaryAndSecondaryRoles], [...disallowedRoles]),
    );
    return effectiveRoles.has((request.user as User).role);
  }

  private getPrimaryRoles(context: ExecutionContext) {
    return new Set(
      this.reflector.getAllAndOverride<Role[]>(PRIMARY_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [],
    );
  }
  private getSecondaryRoles(context: ExecutionContext) {
    return new Set(
      this.reflector.getAllAndOverride<Role[]>(SECONDARY_ROLES_KEY, [
        context.getHandler(),
      ]) || [],
    );
  }

  private getDisallowedRoles(context: ExecutionContext) {
    return new Set(
      this.reflector.getAllAndOverride<Role[]>(DISALLOWED_ROLES_KEY, [
        context.getHandler(),
      ]) || [],
    );
  }
}
