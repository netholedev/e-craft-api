import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FastifyRequest } from 'fastify';
import { diskStorage } from 'multer';

import { SingleFileDto, MultipleFileDto } from '@lib/base/dtos';

import { FastifyFilesInterceptor, FastifyFileInterceptor } from '@lib/base/interceptors';
import { changeFileName, imageFileFilter } from '@lib/base/helpers';
import { access, readFile } from 'fs-extra';
import { join, extname } from 'path';
import { Auth } from '@lib/base/decorators';
import { UploadService } from '@lib/services';
import { IFile } from '@lib/base/interfaces';

@Auth()
@Controller('uploads')
@ApiTags('Upload File')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('/:folder/:file')
  async getFile(
    @Param('folder') folderName: string,
    @Param('file') fileName: string,
    @Res() reply,
  ) {
    const filePath = join('./uploads', folderName, fileName);

    access(filePath, async (err) => {
      if (!err) {
        const ext = extname(fileName)?.toLowerCase().replace('.', '');
        const contentType = this.uploadService.getFileMimeType(ext);
        reply.type(contentType).send(await readFile(filePath));
        return;
      }

      reply.status(404).send('not found');
      return;
    });
  }

  @ApiConsumes('multipart/form-data')
  @Post('single-file')
  @UseInterceptors(
    FastifyFileInterceptor('photo_url', {
      storage: diskStorage({
        destination: './uploads/single',
        filename: changeFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async single(
    @Req() req: FastifyRequest,
    @UploadedFile() file: IFile,
    @Body() body: SingleFileDto,
  ) {
    return { ...body, photo_url: await this.uploadService.singleFileMapper({ file, req }) };
  }

  @ApiConsumes('multipart/form-data')
  @Post('multiple-file')
  @UseInterceptors(
    FastifyFilesInterceptor('photo_url', 10, {
      storage: diskStorage({
        destination: './uploads/multiple',
        filename: changeFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async multiple(
    @Req() req: FastifyRequest,
    @UploadedFiles() files: IFile[],
    @Body() body: MultipleFileDto,
  ) {
    return { ...body, photo_url: await this.uploadService.multipleFilesMapper({ files, req }) };
  }
}
