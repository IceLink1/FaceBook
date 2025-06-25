import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Updated post content', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ 
    example: ['https://example.com/new-image.jpg'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}