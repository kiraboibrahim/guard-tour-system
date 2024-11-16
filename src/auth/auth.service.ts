import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '@user/user.service';
import { SiteAdmin } from '@site-admin/entities/site-admin.entity';
import { CompanyAdmin } from '@company-admin/entities/company-admin.entity';
import { Role } from '@roles/roles.constants';
import { JWTPayload } from './auth.types';
import { SuperAdmin } from '@super-admin/entities/super-admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid username or password');
    const { user: baseUser } = user;
    const passwordMatch = await argon2.verify(baseUser.password, password);
    if (!passwordMatch)
      throw new UnauthorizedException('Invalid username or password');
    return user;
  }

  async signin(user: SuperAdmin | CompanyAdmin | SiteAdmin) {
    const accessToken = await this.getUserAccessToken(user);
    return {
      access_token: accessToken,
    };
  }
  async getUserAccessToken(user: SuperAdmin | CompanyAdmin | SiteAdmin) {
    // _user refers to the instance of GetUser class from which all other types of users derive
    // and thus _user is the instance that holds attributes shared amongst all users
    const { user: _user } = user;
    let payload: JWTPayload = {
      sub: _user.id,
      role: _user.role as Role,
      email: _user.email,
      firstName: _user.firstName,
      lastName: _user.lastName,
      companyId: user instanceof SuperAdmin ? undefined : user.companyId,
    };

    // Add a managedSiteId to the payload for a site admin user
    if (_user.role === Role.SITE_ADMIN) {
      const siteAdmin = user as SiteAdmin;
      payload = {
        ...payload,
        managedSiteId: siteAdmin.siteId,
      };
    }
    return await this.jwtService.signAsync(payload);
  }
}
