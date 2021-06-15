import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { readFile, writeFile } from 'fs-extra';
import { FastifyRequest } from 'fastify';

import { IFile } from '@lib/base/interfaces';

interface SingleFileMapper {
  file: IFile;
  req: FastifyRequest;
}

interface MultipleFilesMapper {
  files: IFile[];
  req: FastifyRequest;
}

@Injectable()
export class UploadService {
  private readonly contentTypes = {
    APNG: 'image/apng',
    AVIF: 'image/avif',
    GIF: 'image/gif',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    SVG: 'image/svg+xml',
    WEBP: 'image/webp',
  };

  private async resizeImage(file: IFile, req: FastifyRequest) {
    const buff = await sharp(await readFile(file.path))
      .resize(1024)
      .jpeg({ mozjpeg: true })
      .toBuffer();

    await writeFile(file.path, buff);

    const image_url = `${req.protocol}://${req.headers.host}/${file.path}`;
    return {
      originalname: file.originalname,
      filename: file.filename,
      image_url,
    };
  }

  public getFileMimeType(ext: string): string {
    switch (ext) {
      case 'apng':
        return this.contentTypes.APNG;
      case 'avif':
        return this.contentTypes.AVIF;
      case 'gif':
        return this.contentTypes.GIF;
      case 'jpg':
      case 'jpeg':
      case 'jfif':
      case 'pjpeg':
      case 'pjp':
        return this.contentTypes.JPEG;
      case 'png':
        return this.contentTypes.PNG;
      case 'svg':
        return this.contentTypes.SVG;
      case 'webp':
        return this.contentTypes.WEBP;
      default:
        return '';
    }
  }

  public async singleFileMapper({ file, req }: SingleFileMapper) {
    return await this.resizeImage(file, req);
  }

  public async multipleFilesMapper({ files, req }: MultipleFilesMapper) {
    return await Promise.all(files.map(async (file) => this.resizeImage(file, req)));
  }
}
