import { ForbiddenException, Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CompanyEntity } from '@lib/entities';

import { UsersPublicService } from '../users';
import { CompaniesPrivateService, CompaniesPublicService } from '../companies';
import { EmailService } from '../../shared';

@Injectable()
export class AuthPublicService {
  constructor(
    private readonly usersPublicService: UsersPublicService,
    private readonly companiesPrivateService: CompaniesPrivateService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async generatePasswordRecoveryCode(data: { email: string }) {
    const code = await this.usersPublicService.generatePasswordRecoveryCode(data.email);
    await this.emailService.sendForgotPasswordCode(data.email, code);
    return data.email;
  }

  async renewPassword(data: { email: string; code: string; password: string }) {
    const password = await this.usersPublicService.renewPassword(data);
    return this.login({ email: data.email, password: password });
  }

  async login(data: { email: string; password: string }) {
    const foundUser = await this.usersPublicService.findUserForLogin({
      email: data.email,
    });

    if (foundUser && compareSync(data.password, foundUser.password)) {
      delete foundUser.password;
      return {
        token: this.jwtService.sign({
          id: foundUser.id,
        }),
      };
    }

    throw new ForbiddenException('Invalid User Credentials');
  }

  async validateAndRenewRefreshToken(refreshToken: string) {
    return this.usersPublicService.validateAndRenewRefreshToken(refreshToken);
  }

  async validateUser(id: string): Promise<any> {
    const foundUser = await this.usersPublicService.validateUserForLogin(id);

    if (foundUser) {
      const subcompanies = await this.companiesPrivateService.findAllChildrenFlat(
        foundUser.company.id,
      );

      return {
        ...foundUser,
        subCompanies: [foundUser.company.id].concat(subcompanies.map((c: CompanyEntity) => c.id)),
      };
    }

    return null;
  }
}
