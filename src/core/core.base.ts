import { User } from '../auth/auth.types';

export class BaseService {
  protected user: User;

  setUser(user: User) {
    this.user = user;
  }
}
