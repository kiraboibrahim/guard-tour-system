import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Header,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiNotFoundResponse({ description: 'Invalid username or password' })
  @ApiCreatedResponse({
    description: 'Successful signin',
  })
  @ApiExtraModels(SignInDto)
  @ApiBody({
    schema: {
      oneOf: refs(SignInDto),
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req: any) {
    return await this.authService.signin(req.user);
  }
  @Get('signout')
  @Header('Clear-Site-Data', '*')
  signout() {
    return;
  }
}
