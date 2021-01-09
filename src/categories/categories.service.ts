import { Injectable } from '@nestjs/common';
import { CACHE_DURATION, RedisCacheService } from 'shared/cache/redis-cache.service';
import { CategoryDto } from './../categories/categories.model';
import { Category } from './../categories/repository/category.schema';
import { CategoriesRepository } from './repository/categories.repository';

@Injectable()
export class CategoriesService {

  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly redisCacheService: RedisCacheService) {}

  async createCategory(createCategoryDto: CategoryDto): Promise<Category> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  async getCategories(): Promise<Array<Category>> {
    return await this.redisCacheService.getItemOrElse(
      'categories',
      CACHE_DURATION.categories,
      async () => this.categoriesRepository.findAll());
  }

  async getCategory(categoryId: number): Promise<Category> {
    return await this.categoriesRepository.findOne(categoryId);
  }

  async delete(id: number): Promise<Category> {
    return await this.categoriesRepository.delete(id);
  }

  async update(id: number, categoryDto: CategoryDto): Promise<Category> {
    // { new: true } => we want the new, updated document to be returned 
    return await this.categoriesRepository.update(id, categoryDto, { new: true });
  }
}
