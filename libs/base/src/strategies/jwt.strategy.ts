import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthPublicService } from '@lib/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authPublicService: AuthPublicService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const user = await this.authPublicService.validateUser(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    /*
    if (!req.cookies.refreshToken) {
      console.log(req.cookies.refreshToken);
      throw new UnauthorizedException();
    }
    */

    return user;
  }
}
