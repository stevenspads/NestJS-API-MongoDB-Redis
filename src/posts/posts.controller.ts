import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Controller, HttpStatus, Post, Body, Get, UseInterceptors, UseFilters, Put, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { HttpExceptionFilter } from '../shared/exceptions/http-exception.filter';
import { LoggerInterceptor } from '../shared/interceptors/logger.interceptor';
import { BlogPost } from './repository/posts.schema';
import { PostDto } from './posts.model';
import { getPostParam } from './posts.decorator';
import { MongoExceptionFilter } from 'shared/exceptions/mongo-exception.filter';

@ApiTags('posts')
@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully.' })    
  async findAll(): Promise<Array<BlogPost>> {
    return await this.postsService.getPosts();
  }

  @Get(':postId')
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter)  
  @ApiParam({ name: 'postId', type: String, required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post retrieved successfully.' })  
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed: postId must be an integer number.' })
  async findOne(@getPostParam('postId') postId: number): Promise<BlogPost> {
    return await this.postsService.getPost(postId);    
  }

  @Post()  
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @ApiResponse({ status: HttpStatus.OK, description: 'Post created successfully.' })  
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Duplicate key error: title.' })  
  async create(@Body() postDto: PostDto): Promise<BlogPost> {
    return await this.postsService.createPost(postDto);
  }

  @Put(':postId')
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter) 
  @ApiParam({ name: 'postId', type: String, required: true }) 
  @ApiResponse({ status: HttpStatus.OK, description: 'Post updated successfully.' })  
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed: postId must be an integer number.' })    
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Duplicate key error: title.' })  
  async update(@getPostParam('postId') postId: number, @Body() postDto: PostDto) {
    return await this.postsService.update(postId, postDto);
  }

  @Delete(':postId')
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @ApiParam({ name: 'postId', type: String, required: true })  
  @ApiResponse({ status: HttpStatus.OK, description: 'Post deleted successfully.' })  
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed: postId must be an integer number.' })  
  async remove(@getPostParam('postId') postId: number) {
    return await this.postsService.delete(postId);
  }
}
