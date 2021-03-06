import { Module } from '@nestjs/common';
import { Logger } from '@lib/services';

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
