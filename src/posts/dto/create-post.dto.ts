import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'This is my first post!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}