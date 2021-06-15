import { Module } from '@nestjs/common';

import { UploadService } from '@lib/services';

import { AccountsModule } from '../../accounts';

import { UploadController } from './controllers';

@Module({
  imports: [AccountsModule],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
