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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts (feed)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of posts' })
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.postsService.findAll(+page, +limit);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'User posts' })
  findByUser(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.postsService.findByUser(userId, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 403, description: 'You can only update your own posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 403, description: 'You can only delete your own posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.userId);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/unlike a post' })
  @ApiResponse({ status: 200, description: 'Post like status updated' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  likePost(@Param('id') id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.userId);
  }
}