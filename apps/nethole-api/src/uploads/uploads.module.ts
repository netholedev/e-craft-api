import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountsModule } from '../accounts';
import { UploadModule } from '../shared';

import { UploadController } from './controllers';

@Module({
  imports: [ConfigModule, UploadModule, AccountsModule],
  controllers: [UploadController],
})
export class UploadsModule {}
