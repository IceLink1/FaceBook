import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { multerConfig } from './multer.config';
import { FilesService } from './files.service';
import { Response } from 'express';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiBody({
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload'
        }
      }
    },
    examples: {
      example1: {
        summary: 'Upload an image file',
        value: {
          file: {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
            size: 1024
          }
        }
      },
      example2: {
        summary: 'Upload a PDF file',
        value: {
          file: {
            filename: 'document.pdf',
            contentType: 'application/pdf',
            size: 5120
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: {
        filename: '1692654321-image.jpg',
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/1692654321-image.jpg'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or size too large',
    schema: {
      example: {
        message: 'Invalid file type. Only JPG, JPEG, PNG, GIF, and PDF files are allowed.'
      }
    }
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: any) { //Express.Multer.File
    return this.filesService.uploadFile(file);
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Get a file by filename' })
  @ApiParam({
    name: 'filename',
    description: 'The unique filename of the file to retrieve'
  })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'File not found'
  })
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.filesService.getFile(filename);
    res.sendFile(filePath);
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'Delete a file by filename' })
  @ApiParam({
    name: 'filename',
    description: 'The unique filename of the file to delete'
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      example: {
        message: 'File deleted successfully'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'File not found'
  })
  deleteFile(@Param('filename') filename: string) {
    return this.filesService.deleteFile(filename);
  }
}
