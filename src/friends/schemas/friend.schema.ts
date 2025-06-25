import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendDocument = Friend & Document;

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

@Schema({ timestamps: true })
export class Friend {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ enum: FriendStatus, default: FriendStatus.PENDING })
  status: FriendStatus;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

// Ensure unique friendship combinations
FriendSchema.index({ requester: 1, recipient: 1 }, { unique: true });