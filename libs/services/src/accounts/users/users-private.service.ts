import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { PrivateBaseService } from '@lib/base/abstract/typeorm';
import { UserEntity } from '@lib/entities';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersPrivateService extends PrivateBaseService<UserEntity> {
  constructor(protected readonly _repository: UsersRepository) {
    super(_repository);

    this.insertOne = async (data: UserEntity) => {
      data.password = hashSync(data.password, 12);
      const newUser = await this._repository.insertOne({ ...data });
      delete newUser.password;
      return newUser;
    };
  }
}
