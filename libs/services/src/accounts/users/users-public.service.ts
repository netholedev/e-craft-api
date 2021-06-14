import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { PublicBaseService } from '@lib/base/abstract/typeorm';
import { ICurrentUser } from '@lib/base/interfaces';

import { UserEntity, CompanyEntity } from '@lib/entities';

import { UsersRepository } from './users.repository';

import { RolesPublicService } from '../roles';

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
}
