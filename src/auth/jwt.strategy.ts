import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CompanyAdmin,
  JWTPayload,
  SiteAdmin,
  SuperAdmin,
  User,
  BaseUser,
} from './auth.types';
import { plainToInstance } from 'class-transformer';
import { Role } from '../roles/roles';

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
      case Role.SUPER_ADMIN:
        user = plainToInstance(SuperAdmin, userPayload);
        break;
      case Role.COMPANY_ADMIN:
        user = plainToInstance(CompanyAdmin, userPayload);
        break;
      case Role.SITE_ADMIN:
        user = plainToInstance(SiteAdmin, userPayload);
        break;
      default:
        user = plainToInstance(BaseUser, userPayload);
    }
    return user;
  }
}
