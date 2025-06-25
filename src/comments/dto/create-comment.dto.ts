import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  @IsNotEmpty()
  post: string;

  @ApiProperty({ example: 'Great post!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}