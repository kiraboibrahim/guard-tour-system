import { Role } from '../roles/roles.types';

export type JWTStrategyReturnedUser = {
  id: number;
  role: Role;
  companyId?: number;
};
