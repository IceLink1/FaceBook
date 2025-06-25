import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friend, FriendDocument, FriendStatus } from "./schemas/friend.schema";
import { CreateFriendRequestDto } from "./dto/create-friend-request.dto";
import { UpdateFriendRequestDto } from "./dto/update-friend-request.dto";

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>
  ) {}

  async sendFriendRequest(
    createFriendRequestDto: CreateFriendRequestDto,
    requesterId: string
  ): Promise<Friend> {
    const { recipient } = createFriendRequestDto;

    if (requesterId === recipient) {
      throw new BadRequestException(
        "You cannot send a friend request to yourself"
      );
    }

    // Check if friendship already exists
    const existingFriendship = await this.friendModel.findOne({
      $or: [
        { requester: requesterId, recipient },
        { requester: recipient, recipient: requesterId },
      ],
    });

    if (existingFriendship) {
      throw new ConflictException(
        "Friend request already exists or users are already friends"
      );
    }

    const friendRequest = new this.friendModel({
      requester: requesterId,
      recipient,
      status: FriendStatus.PENDING,
    });

    const savedRequest = await friendRequest.save();
    return this.friendModel
      .findById(savedRequest._id)
      .populate("requester", "firstName lastName avatar")
      .populate("recipient", "firstName lastName avatar")
      .exec();
  }

  async updateFriendRequest(
    id: string,
    updateFriendRequestDto: UpdateFriendRequestDto,
    userId: string
  ): Promise<Friend> {
    const friendRequest = await this.friendModel.findById(id);

    if (!friendRequest) {
      throw new NotFoundException("Friend request not found");
    }

    // Only the recipient can update the friend request
    if (friendRequest.recipient.toString() !== userId) {
      throw new BadRequestException(
        "You can only respond to friend requests sent to you"
      );
    }

    const updatedRequest = await this.friendModel
      .findByIdAndUpdate(
        id,
        { status: updateFriendRequestDto.status },
        { new: true }
      )
      .populate("requester", "firstName lastName avatar")
      .populate("recipient", "firstName lastName avatar")
      .exec();

    return updatedRequest;
  }

  async getFriends(userId: string): Promise<any[]> {
    const friendships = await this.friendModel
      .find({
        $or: [
          { requester: userId, status: FriendStatus.ACCEPTED },
          { recipient: userId, status: FriendStatus.ACCEPTED },
        ],
      })
      .populate("requester", "firstName lastName avatar")
      .populate("recipient", "firstName lastName avatar")
      .exec();

    return friendships.map((friendship: any) => {
      const friend =
        friendship.requester._id.toString() === userId
          ? friendship.recipient
          : friendship.requester;

      return {
        friendshipId: friendship._id,
        friend,
        since: friendship.createdAt,
      };
    });
  }

  async getPendingRequests(userId: string): Promise<Friend[]> {
    return this.friendModel
      .find({ recipient: userId, status: FriendStatus.PENDING })
      .populate("requester", "firstName lastName avatar")
      .populate("recipient", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSentRequests(userId: string): Promise<Friend[]> {
    return this.friendModel
      .find({ requester: userId, status: FriendStatus.PENDING })
      .populate("requester", "firstName lastName avatar")
      .populate("recipient", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .exec();
  }

  async removeFriend(friendshipId: string, userId: string): Promise<void> {
    const friendship = await this.friendModel.findById(friendshipId);

    if (!friendship) {
      throw new NotFoundException("Friendship not found");
    }

    // Check if user is part of this friendship
    if (
      friendship.requester.toString() !== userId &&
      friendship.recipient.toString() !== userId
    ) {
      throw new BadRequestException("You are not part of this friendship");
    }

    await this.friendModel.findByIdAndDelete(friendshipId);
  }

  async getFriendshipStatus(
    userId: string,
    otherUserId: string
  ): Promise<{ status: string; canSendRequest: boolean }> {
    const friendship = await this.friendModel.findOne({
      $or: [
        { requester: userId, recipient: otherUserId },
        { requester: otherUserId, recipient: userId },
      ],
    });

    if (!friendship) {
      return { status: "none", canSendRequest: true };
    }

    const isRequester = friendship.requester.toString() === userId;

    return {
      status: friendship.status,
      canSendRequest: false,
    };
  }
}
