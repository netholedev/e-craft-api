import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthPublicService } from '@lib/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authPublicService: AuthPublicService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username: string /* , password: string */): Promise<any> {
    const user = await this.authPublicService.validateUser(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
