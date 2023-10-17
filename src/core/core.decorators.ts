import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '../user/entities/user.base.entity';
import { JWTStrategyReturnedUser } from './core.types';

export const User = createParamDecorator<UserEntity | JWTStrategyReturnedUser>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
