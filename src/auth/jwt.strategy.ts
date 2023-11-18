import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CompanyAdmin,
  JWTPayload,
  SiteAdmin,
  SuperAdmin,
  SecurityGuard,
  User,
  BaseUser,
} from './auth.types';
import { plainToInstance } from 'class-transformer';
import {
  COMPANY_ADMIN_ROLE,
  SECURITY_GUARD_ROLE,
  SITE_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from '../roles/roles.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
    });
  }

  validate(payload: JWTPayload): User {
    const { sub: id, ...rest } = payload;
    const userPayload = { id, ...rest };
    let user;
    switch (userPayload.role) {
      case SUPER_ADMIN_ROLE:
        user = plainToInstance(SuperAdmin, userPayload);
        break;
      case COMPANY_ADMIN_ROLE:
        user = plainToInstance(CompanyAdmin, userPayload);
        break;
      case SITE_ADMIN_ROLE:
        user = plainToInstance(SiteAdmin, userPayload);
        break;
      case SECURITY_GUARD_ROLE:
        user = plainToInstance(SecurityGuard, userPayload);
        break;
      default:
        user = plainToInstance(BaseUser, userPayload);
    }
    return user;
  }
}
