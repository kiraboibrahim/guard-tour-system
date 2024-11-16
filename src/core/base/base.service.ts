import { BadRequestException, Logger } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { User } from '@auth/auth.types';
import { isEmpty } from 'lodash';

export class BaseService {
  private _user: User;
  private readonly logger = new Logger(BaseService.name);

  setUser(user: User) {
    this._user = user;
  }

  get user() {
    if (!this._user) {
      const serviceClassName = this.constructor.name;
      const errorMsg = `The 'user' is undefined(not authenticated). If the route is supposed to be private, then you have to invoke ${serviceClassName}.setUser(user) in the controller in addition to changing the route from public to private`;
      this.logger.error(errorMsg);
    }
    return this._user;
  }

  handleMissingUpdateValues(updateDto: any) {
    if (isEmpty(updateDto)) {
      throw new BadRequestException('Missing update values');
    }
  }

  applyFilters(query: PaginateQuery) {
    this.applyUserCompanyFilter(query);
    this.applySiteOwnerFilter(query);
  }

  private applyUserCompanyFilter(query: PaginateQuery) {
    if (this.user.isSuperAdmin() || this.user.isSiteOwner()) {
      return;
    }
    const { filter } = query;
    // Mutate the original query instead or creating or returning a new one
    query.filter = {
      ...filter,
      companyId: [`${this.user.companyId}`],
    };
  }

  private applySiteOwnerFilter(query: PaginateQuery) {
    if (this.user.isSiteOwner()) {
      const { filter } = query;
      // Mutate the original query instead or creating or returning a new one
      query.filter = {
        ...filter,
        ownerUserId: [`${this.user.id}`],
      };
    }
  }
}
