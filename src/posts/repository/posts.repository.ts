import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostDto } from "./../posts.model";
import { PostDocument, BlogPost } from "./posts.schema";
import { NotFoundException } from "./../../shared/exceptions/http-exceptions";

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(BlogPost.name) private postModel: Model<PostDocument>) {}

  public async findAll(): Promise<Array<BlogPost>> {
    return await this.postModel.find().exec();
  }

  public async findOne(postId: number): Promise<BlogPost> {
    return await this.postModel.findOne({ postId }).orFail(() => {
      throw new NotFoundException('Post not found.');
    });
  }

  public async create(postDto: PostDto): Promise<BlogPost> {
    const created = new this.postModel(postDto);
    return await created.save();
  }

  public async delete(postId: number): Promise<BlogPost> {
    return await this.postModel.findOneAndDelete({ postId }).orFail(() => {
      throw new NotFoundException('Post not found.');
    });
  }

  public async update(postId: number, postDto: PostDto, options: any): Promise<BlogPost> {
    return await this.postModel.findOneAndUpdate({ postId }, postDto, options).orFail(() => {
      throw new NotFoundException('Post not found.');
    });
  }  
}
