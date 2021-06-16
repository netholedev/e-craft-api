import { Module } from '@nestjs/common';

import { UploadService } from '@lib/services';

@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
