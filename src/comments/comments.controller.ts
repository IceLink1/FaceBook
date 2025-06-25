import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user.userId);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of comments' })
  findByPost(
    @Param('postId') postId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.commentsService.findByPost(postId, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment found' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 403, description: 'You can only update your own comments' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    return this.commentsService.update(id, updateCommentDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 403, description: 'You can only delete your own comments' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user.userId);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/unlike a comment' })
  @ApiResponse({ status: 200, description: 'Comment like status updated' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  likeComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.likeComment(id, req.user.userId);
  }
}