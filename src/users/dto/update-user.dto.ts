import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Updated bio about myself', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'San Francisco, CA', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'https://newwebsite.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;
}