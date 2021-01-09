import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Controller, HttpStatus, Post, Body, Get, UseInterceptors, UseFilters, Put, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HttpExceptionFilter } from './..//shared/exceptions/http-exception.filter';
import { LoggerInterceptor } from './../shared/interceptors/logger.interceptor';
import { getCategoryParam } from './../categories/categories.decorator';
import { CategoryDto } from './../categories/categories.model';
import { Category } from './repository/category.schema';
import { MongoExceptionFilter } from 'shared/exceptions/mongo-exception.filter';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @ApiResponse({ status: HttpStatus.OK, description: 'Categories retrieved successfully.' })    
  async findAll(): Promise<Array<Category>> {
    return await this.categoriesService.getCategories();
  }

  @Get(':categoryId')
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter)  
  @ApiParam({ name: 'categoryId', type: String, required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category retrieved successfully.' })  
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed: categoryId must be an integer number.' })
  async findOne(@getCategoryParam('categoryId') categoryId: number): Promise<Category> {
    return await this.categoriesService.getCategory(categoryId);    
  }

  @Post()  
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter)
  @ApiResponse({ status: HttpStatus.OK, description: 'Category created successfully.' })  
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Duplicate key error: name.' })  
  async create(@Body() createCategoryDto: CategoryDto): Promise<Category> {    
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Put(':categoryId')
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter, MongoExceptionFilter) 
  @ApiParam({ name: 'categoryId', type: String, required: true }) 
  @ApiResponse({ status: HttpStatus.OK, description: 'Category updated successfully.' })  
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed: categoryId must be an integer number.' })  
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Duplicate key error: name.' })  
  update(@getCategoryParam('categoryId') categoryId: number, @Body() categoryDto: CategoryDto) {
    return this.categoriesService.update(categoryId, categoryDto);
  }

  @Delete(':categoryId')
  @UseInterceptors(LoggerInterceptor)
  @UseFilters(HttpExceptionFilter)
  @ApiParam({ name: 'categoryId', type: String, required: true })  
  @ApiResponse({ status: HttpStatus.OK, description: 'Category deleted successfully.' })  
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed: categoryId must be an integer number.' })  
  remove(@getCategoryParam('categoryId') categoryId: number) {
    return this.categoriesService.delete(categoryId);
  }
}
