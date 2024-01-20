import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IsPublicMixin } from './auth.mixins';
import { applyMixins } from '../core/core.utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IsPublicMixin {
  isPublic: (reflector: Reflector, context: ExecutionContext) => boolean;

  constructor(private reflector: Reflector) {
    super();
  }
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.isPublic(this.reflector, context);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

applyMixins(JwtAuthGuard, IsPublicMixin);
