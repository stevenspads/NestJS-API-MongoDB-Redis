import { Injectable } from '@nestjs/common';
import { CACHE_DURATION, RedisCacheService } from 'shared/cache/redis-cache.service';
import { PostDto } from './posts.model';
import { PostsRepository } from './repository/posts.repository';
import { BlogPost } from './repository/posts.schema';

@Injectable()
export class PostsService {

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly redisCacheService: RedisCacheService) {}

  async createPost(postDto: PostDto): Promise<BlogPost> {
    return this.postsRepository.create(postDto);
  }

  async getPosts(): Promise<Array<BlogPost>> {
    return await this.redisCacheService.getItemOrElse(
      'posts',
      CACHE_DURATION.posts,
      async () => this.postsRepository.findAll());
  }

  async getPost(categoryId: number): Promise<BlogPost> {
    return await this.postsRepository.findOne(categoryId);
  }

  async delete(id: number): Promise<BlogPost> {
    return await this.postsRepository.delete(id);
  }

  async update(id: number, postDto: PostDto): Promise<BlogPost> {
    // { new: true } => we want the new, updated document to be returned 
    return await this.postsRepository.update(id, postDto, { new: true });
  }
}
