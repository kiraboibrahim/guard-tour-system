import { Injectable } from '@nestjs/common';
import { AccessControl } from 'accesscontrol';
import permissions from './permissions.constants';

@Injectable()
export class PermissionsService extends AccessControl {
  constructor() {
    super(permissions);
  }
}
