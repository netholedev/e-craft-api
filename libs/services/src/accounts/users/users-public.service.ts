import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import * as moment from 'moment';

import { PublicBaseService } from '@lib/base/abstract/typeorm';
import { ICurrentUser } from '@lib/base/interfaces';

import { UserEntity, CompanyEntity } from '@lib/entities';

import { UsersRepository } from './users.repository';

import { RolesPublicService } from '../roles';
import { v4 } from 'uuid';

@Injectable()
export class UsersPublicService extends PublicBaseService<UserEntity> {
  constructor(
    protected readonly _repository: UsersRepository,
    private readonly rolesPublicService: RolesPublicService,
  ) {
    super(_repository);

    this.insertOne = async (user: ICurrentUser, data: UserEntity) => {
      if (data.password) {
        data.password = hashSync(data.password, 12);
      }

      if (!data.role) {
        const defaultRole = await this.rolesPublicService.findOne(user, null, {
          where: { isDefault: true, company: data.company },
          select: ['id'],
        });

        data.role = defaultRole;
      }

      const company = new CompanyEntity();
      company.id = user.subCompanies[0];

      if (!data.company) {
        data.company = company;
      } else {
        if (user.subCompanies.includes(data.company.id)) {
          data.company.id = data.company.id;
        } else {
          data.company = company;
        }
      }

      const newUser = await this._repository.insertOne({ ...data });
      delete newUser.password;
      return newUser;
    };
  }

  async renewPassword(data: { email: string; code: string; password: string }) {
    const isValid = await this._repository.findOne(null, {
      where: { email: data.email, code: data.code },
      select: ['password'],
    });

    if (isValid && moment().diff(moment(isValid.expire), 'seconds') < 0) {
      const password = hashSync(data.password, 12);

      await this._repository.updateOne({ email: data.email, code: data.code }, { password });
      return data.password;
    } else {
      throw 'TIMEOUT';
    }
  }

  async generatePasswordRecoveryCode(email: string) {
    const code = randomBytes(32).toString('hex');

    await this._repository.updateOne(
      { email, isActive: true },
      { code, expire: moment().add('1h').toDate() },
    );

    return code;
  }

  async findUserForLogin(data: { email: string }) {
    return this._repository.findOne(null, {
      where: { email: data.email, isActive: true },
      select: ['password', 'id', 'email'],
    });
  }

  async validateUserForLogin(id: string) {
    return this._repository.findOne(null, {
      where: { id, isActive: true },
      select: ['id', 'email', 'role', 'company', 'isSuperAdmin'],
      loadEagerRelations: true,
      relations: ['role', 'company'],
    });
  }

  async validateAndRenewRefreshToken(refreshToken: string) {
    const isValid = await this._repository.findOne(null, {
      where: { refreshToken, isActive: true },
      select: ['id'],
    });

    if (isValid) {
      const newToken = v4();
      await this._repository.updateOne({ id: isValid.id }, { refreshToken: newToken });
      return newToken;
    }

    throw 'Invalid refresh token';
  }
}
