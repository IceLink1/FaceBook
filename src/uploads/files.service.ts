import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class FilesService {
  private readonly uploadsDir = join(process.cwd(), 'uploading');

  uploadFile(file: any) { //Express.Multer.File
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    };
  }

  getFile(filename: string) {
    const filePath = join(this.uploadsDir, filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return filePath;
  }

  getStaticFilePath(filename: string) {
    return join(this.uploadsDir, filename);
  }

  deleteFile(filename: string) {
    const filePath = join(this.uploadsDir, filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return { message: 'File deleted successfully' };
    }
    throw new NotFoundException('File not found');
  }
}
