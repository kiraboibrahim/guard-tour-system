import { Logger } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { User } from '../auth/auth.types';

export class BaseService {
  private _user: User;
  private readonly logger = new Logger(BaseService.name);

  setUser(user: User) {
    this._user = user;
  }

  get user() {
    if (!this._user) {
      const _class = this.constructor.name;
      const errorMsg = `You need to set the 'user' in the controller by calling ${_class}.setUser(user). If you have then, the 'user' argument is undefined or the route is public`;
      this.logger.error(errorMsg);
    }
    return this._user;
  }

  filterOnUserCompany(query: PaginateQuery) {
    if (!this.user.isSuperAdmin()) {
      const { filter } = query;
      // Mutate the original query instead or creating or returning a new one
      query.filter = {
        ...filter,
        companyId: [`${this.user.companyId}`],
      };
    }
  }
}
