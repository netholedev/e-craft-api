import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile, utils } from 'xlsx';

import { IFile } from '@lib/base/interfaces';
import { FileService } from '../file';
import { ConfigService } from '@nestjs/config';

/*
{
  fieldname: 'xls',
  originalname: 'feed.xlsx',
  encoding: '7bit',
  mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  destination: 'upload/xls',
  filename: '42cecc1d917c2c685258e1b8f0d036cd',
  path: 'upload/xls/42cecc1d917c2c685258e1b8f0d036cd',
  size: 216257
}
*/

@Injectable()
export class XlsService {
  private readonly UPLOAD_PATH = 'uploads/xls'; // TODO: change with constant

  constructor(private readonly fileService: FileService) {}

  excelToJson(file: IFile): Record<any, any>[] {
    const xls = readFile(join(this.UPLOAD_PATH, file.filename), {
      // TODO
    });

    const json = utils.sheet_to_json(xls.Sheets[xls.SheetNames[0]]);
    this.fileService.deleteUploadedFile(this.UPLOAD_PATH + file.filename);
    return json;
  }
}
