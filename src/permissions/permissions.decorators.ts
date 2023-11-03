import { SetMetadata } from '@nestjs/common';

export const RequiredPermission = (action: string, resource: string) =>
  SetMetadata('requiredPermission', [action, resource]);
