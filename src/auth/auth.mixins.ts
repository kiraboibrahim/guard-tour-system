import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './auth.decorators';

export class IsPublicMixin {
  isPublic(reflector: Reflector, context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return (
      reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getClass(),
        context.getHandler(),
      ]) && !request.user
    );
  }
}
