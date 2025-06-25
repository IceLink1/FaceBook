import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Updated comment content', required: false })
  @IsOptional()
  @IsString()
  content?: string;
}