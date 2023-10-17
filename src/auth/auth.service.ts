import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.base.entity';
import * as argon2 from 'argon2';
import { UserService } from '../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new UnauthorizedException();
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) throw new UnauthorizedException();
    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
      companyId: (user as any).companyId,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
