import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const createdPost = new this.postModel({
      ...createPostDto,
      author: authorId,
    });
    
    const savedPost = await createdPost.save();
    return this.postModel
      .findById(savedPost._id)
      .populate('author', 'firstName lastName avatar')
      .exec();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Post[]> {
    const skip = (page - 1) * limit;
    return this.postModel
      .find({ isActive: true })
      .populate('author', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'firstName lastName avatar')
      .exec();
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    return post;
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10): Promise<Post[]> {
    const skip = (page - 1) * limit;
    return this.postModel
      .find({ author: userId, isActive: true })
      .populate('author', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('author', 'firstName lastName avatar')
      .exec();

    return updatedPost;
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(id);
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndUpdate(id, { isActive: false });
  }

  async likePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userObjectId = userId as any;
    const isLiked = post.likes.includes(userObjectId);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userObjectId);
    }
    
    await post.save();
    
    return this.postModel
      .findById(postId)
      .populate('author', 'firstName lastName avatar')
      .exec();
  }
}