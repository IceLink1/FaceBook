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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: 201, description: 'Friend request sent successfully' })
  @ApiResponse({ status: 400, description: 'Cannot send request to yourself' })
  @ApiResponse({ status: 409, description: 'Friend request already exists' })
  sendFriendRequest(@Body() createFriendRequestDto: CreateFriendRequestDto, @Request() req) {
    return this.friendsService.sendFriendRequest(createFriendRequestDto, req.user.userId);
  }

  @Patch('request/:id')
  @ApiOperation({ summary: 'Accept/decline friend request' })
  @ApiResponse({ status: 200, description: 'Friend request updated successfully' })
  @ApiResponse({ status: 400, description: 'You can only respond to requests sent to you' })
  @ApiResponse({ status: 404, description: 'Friend request not found' })
  updateFriendRequest(
    @Param('id') id: string,
    @Body() updateFriendRequestDto: UpdateFriendRequestDto,
    @Request() req,
  ) {
    return this.friendsService.updateFriendRequest(id, updateFriendRequestDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user friends list' })
  @ApiResponse({ status: 200, description: 'List of friends' })
  getFriends(@Request() req) {
    return this.friendsService.getFriends(req.user.userId);
  }

  @Get('requests/pending')
  @ApiOperation({ summary: 'Get pending friend requests received' })
  @ApiResponse({ status: 200, description: 'List of pending friend requests' })
  getPendingRequests(@Request() req) {
    return this.friendsService.getPendingRequests(req.user.userId);
  }

  @Get('requests/sent')
  @ApiOperation({ summary: 'Get sent friend requests' })
  @ApiResponse({ status: 200, description: 'List of sent friend requests' })
  getSentRequests(@Request() req) {
    return this.friendsService.getSentRequests(req.user.userId);
  }

  @Get('status/:userId')
  @ApiOperation({ summary: 'Get friendship status with another user' })
  @ApiResponse({ status: 200, description: 'Friendship status' })
  getFriendshipStatus(@Param('userId') userId: string, @Request() req) {
    return this.friendsService.getFriendshipStatus(req.user.userId, userId);
  }

  @Delete(':friendshipId')
  @ApiOperation({ summary: 'Remove friend' })
  @ApiResponse({ status: 200, description: 'Friend removed successfully' })
  @ApiResponse({ status: 404, description: 'Friendship not found' })
  removeFriend(@Param('friendshipId') friendshipId: string, @Request() req) {
    return this.friendsService.removeFriend(friendshipId, req.user.userId);
  }
}