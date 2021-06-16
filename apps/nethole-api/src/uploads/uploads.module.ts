import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts';
import { UploadModule } from '../shared';

import { UploadController } from './controllers';

@Module({
  imports: [UploadModule, AccountsModule],
  controllers: [UploadController],
})
export class UploadsModule {}
