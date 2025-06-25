import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop()
  location?: string;

  @Prop()
  website?: string;

  @Prop({ default: Date.now })
  dateOfBirth?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);