import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '@user/user.service';
import { SiteAdmin } from '@site-admin/entities/site-admin.entity';
import { CompanyAdmin } from '@company-admin/entities/company-admin.entity';
import { Role } from '@roles/roles.constants';
import { JWTPayload } from './auth.types';
import { SuperAdmin } from '@super-admin/entities/super-admin.entity';
import { Company } from '@company/entities/company.entity';

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
    const {
      user: { id, role, email, firstName, lastName },
    } = user;
    let payload: JWTPayload = {
      sub: id,
      role,
      email,
      firstName,
      lastName,
      companyId: user instanceof SuperAdmin ? undefined : user.companyId,
    };

    // Add a managedSiteId to the payload for a site admin user
    if (role === Role.SITE_ADMIN) {
      const { siteId } = user as SiteAdmin;
      payload = {
        ...payload,
        managedSiteId: siteId,
      };
    }
    // Add a company object to the JWT payload of the company admin
    if (role === Role.COMPANY_ADMIN) {
      const { company } = user as CompanyAdmin;
      payload = { ...payload, company };
    }
    return await this.jwtService.signAsync(payload);
  }
}
