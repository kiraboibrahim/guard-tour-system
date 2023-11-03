import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Welcome to the Guard Tour System API! Designed and developed by Kirabo Ibrahim';
  }
}
