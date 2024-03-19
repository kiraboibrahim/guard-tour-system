import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IsPublicMixin } from './auth.mixins';
import { applyMixins } from '../core/core.utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IsPublicMixin {
  isPublic: (reflector: Reflector, context: ExecutionContext) => boolean;
  private _isPublic: boolean;
  constructor(private reflector: Reflector) {
    super();
  }
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this._isPublic = this.isPublic(this.reflector, context);
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any) {
    // Some endpoints still use authentication even when made public inorder to grant privileged
    // features to the authorized users. The reason for calling super.canActivate() first is to verify
    // the access token when given and proceed with the normal authentication. However, in cases, where
    // the access token isn't given and the route is public, we don't raise any authentication errors.
    if (err && this._isPublic) {
      return undefined;
    }
    return user;
  }
}

applyMixins(JwtAuthGuard, IsPublicMixin);
