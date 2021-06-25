import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthPublicService } from '@lib/services';
import { ForgotPasswordDto, LoginDto, RenewPasswordDto } from '@lib/base/dtos';
import { Auth, CurrentUser } from '@lib/base/decorators';
import { ICurrentUser } from '@lib/base/interfaces';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authPublicService: AuthPublicService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authPublicService.login(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authPublicService.generatePasswordRecoveryCode(body);
  }

  @Get('check-code')
  async checkCode(@Query('code') code: string) {
    return this.authPublicService.checkCode(code);
  }

  @Put('renew-password')
  async renewPassword(@Body() body: RenewPasswordDto) {
    return this.authPublicService.renewPassword(body);
  }

  @Get('profile')
  @Auth()
  async profile(@CurrentUser() user: ICurrentUser) {
    return user;
  }
}
