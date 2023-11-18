import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../user/services/user.service';
import { SiteAdmin } from '../user/entities/site-admin.entity';
import { SecurityGuard } from '../user/entities/security-guard.entity';
import { CompanyAdmin } from '../user/entities/company-admin.entity';
import { SECURITY_GUARD_ROLE, SITE_ADMIN_ROLE } from '../roles/roles.constants';
import { JWTPayload } from './auth.types';
import { SuperAdmin } from '../user/entities/super-admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new UnauthorizedException();
    const { user: baseUser } = user;
    const passwordMatch = await argon2.verify(baseUser.password, password);
    if (!passwordMatch) throw new UnauthorizedException();
    return user;
  }

  async signin(user: SuperAdmin | CompanyAdmin | SiteAdmin | SecurityGuard) {
    const { user: baseUser } = user;
    let payload: JWTPayload = {
      sub: user.userId,
      role: baseUser.role,
      username: baseUser.username,
      firstName: baseUser.firstName,
      companyId: user instanceof SuperAdmin ? undefined : user.companyId,
    };
    switch (baseUser.role) {
      case SITE_ADMIN_ROLE:
        const siteAdmin = user as SiteAdmin;
        payload = {
          ...payload,
          managedSiteId: siteAdmin.siteId,
        };
        break;
      case SECURITY_GUARD_ROLE:
        const securityGuard = user as SecurityGuard;
        payload = {
          ...payload,
          deployedSiteId: securityGuard.deployedSiteId,
          shiftId: securityGuard.shiftId,
        };
        break;
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
