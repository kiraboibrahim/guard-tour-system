import { Controller, Post, Body } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return 'This action authenticates a user';
  }
}
