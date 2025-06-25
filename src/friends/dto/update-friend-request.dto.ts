import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FriendStatus } from '../schemas/friend.schema';

export class UpdateFriendRequestDto {
  @ApiProperty({ enum: FriendStatus, example: FriendStatus.ACCEPTED })
  @IsEnum(FriendStatus)
  @IsNotEmpty()
  status: FriendStatus;
}