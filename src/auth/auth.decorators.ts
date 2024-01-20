import { Role } from '../roles/roles';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AllowOnly } from '../roles/roles.decorators';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    ApiBearerAuth(),
    AllowOnly(...roles),
    UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard),
  );
};

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const IS_PUBLIC_KEY = 'IS_PUBLIC';
export const IsPublic = () => {
  return SetMetadata(IS_PUBLIC_KEY, true);
};
