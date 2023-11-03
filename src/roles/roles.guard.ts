import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RequiredRoles } from './roles.decorators';
import { Role } from './roles.types';

@Injectable()
export class RolesGuard implements CanActivate {
  private requiredRoles: Role[];
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.requiredRoles = this.reflector.getAllAndOverride(RequiredRoles, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!this.requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return this.isAuthorizedUser(request.user);
  }
  isAuthorizedUser(user: any) {
    return this.requiredRoles.includes(user.role);
  }
}
