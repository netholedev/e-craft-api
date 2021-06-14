import { Module } from '@nestjs/common';

import { XlsService, FileService } from '@lib/services';

import { UploadController } from './controllers';

@Module({
  providers: [FileService, XlsService],
  controllers: [UploadController],
})
export class UploadModule {}
