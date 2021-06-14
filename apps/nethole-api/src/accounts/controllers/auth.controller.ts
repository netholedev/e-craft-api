import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthPublicService } from '@lib/services';

import { LoginDto } from '@lib/base/dtos';
import { Auth, CurrentUser } from '@lib/base/decorators';
import { ICurrentUser } from '@lib/base/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authPublicService: AuthPublicService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authPublicService.login(body);
  }

  @Get('profile')
  @Auth()
  async profile(@CurrentUser() user: ICurrentUser) {
    return user;
  }
}
