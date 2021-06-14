import { diskStorage } from 'multer';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

import { XlsService } from '@lib/services';
import { IFile } from '@lib/base/interfaces';
import { changeFileName, imageFileFilter, xlsFileFilter } from '@lib/base/filters';
import { FastifySingleFileInterceptor } from '@lib/base/interceptors';

@Controller('upload')
export class UploadController {
  constructor(private readonly xlsService: XlsService) {}

  @Post('excel')
  @UseInterceptors(
    FastifySingleFileInterceptor('xls', {
      fileFilter: xlsFileFilter,
      storage: diskStorage({
        destination: 'upload/xls',
        filename: changeFileName,
      }),
      limits: { fileSize: 9000000 },
    }),
  )
  async fromExcel(@UploadedFile() file: IFile) {
    const json = this.xlsService.excelToJson(file);
    return json;
    // TODO
  }

  @Post('image')
  @UseInterceptors(
    FastifySingleFileInterceptor('image', {
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: 'upload/images',
        filename: changeFileName,
      }),
      limits: { fileSize: 1500000 },
    }),
  )
  async image(@UploadedFile() file: IFile) {
    // TODO
    return file;
  }
}
