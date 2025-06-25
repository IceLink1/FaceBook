import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const post = await this.postModel.findById(createCommentDto.post);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const createdComment = new this.commentModel({
      ...createCommentDto,
      author: authorId,
    });
    
    const savedComment = await createdComment.save();
    
    // Update post comments count
    await this.postModel.findByIdAndUpdate(
      createCommentDto.post,
      { $inc: { commentsCount: 1 } }
    );
    
    return this.commentModel
      .findById(savedComment._id)
      .populate('author', 'firstName lastName avatar')
      .exec();
  }

  async findByPost(postId: string, page: number = 1, limit: number = 10): Promise<Comment[]> {
    const skip = (page - 1) * limit;
    return this.commentModel
      .find({ post: postId, isActive: true })
      .populate('author', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'firstName lastName avatar')
      .exec();
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .populate('author', 'firstName lastName avatar')
      .exec();

    return updatedComment;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(id);
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentModel.findByIdAndUpdate(id, { isActive: false });
    
    // Update post comments count
    await this.postModel.findByIdAndUpdate(
      comment.post,
      { $inc: { commentsCount: -1 } }
    );
  }

  async likeComment(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userObjectId = userId as any;
    const isLiked = comment.likes.includes(userObjectId);
    
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userObjectId);
    }
    
    await comment.save();
    
    return this.commentModel
      .findById(commentId)
      .populate('author', 'firstName lastName avatar')
      .exec();
  }
}