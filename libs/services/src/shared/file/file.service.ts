import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs'; // TODO: change with async

@Injectable()
export class FileService {
  public deleteUploadedFile(fileName: string) {
    return unlinkSync(fileName);
  }
}
