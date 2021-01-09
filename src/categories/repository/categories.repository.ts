import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CategoryDto } from "./../categories.model";
import { Model } from "mongoose";
import { NotFoundException } from "./../../shared/exceptions/http-exceptions";
import { Category, CategoryDocument } from "./category.schema";

@Injectable()
export class CategoriesRepository {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  public async findAll(): Promise<Array<Category>> {
    return await this.categoryModel.find().exec();
  }

  public async findOne(categoryId: number): Promise<Category> {
    return await this.categoryModel.findOne({ categoryId }).orFail(() => {
      throw new NotFoundException('Category not found.');
    });
  }
  
  public async create(createCategoryDto: CategoryDto): Promise<Category> {
    const created: CategoryDocument = new this.categoryModel(createCategoryDto);
    return await created.save();
  }

  public async delete(categoryId: number): Promise<Category> {
    return await this.categoryModel.findOneAndDelete({ categoryId }).orFail(() => {
      throw new NotFoundException('Category not found.');
    });
  }

  public async update(categoryId: number, categoryDto: CategoryDto, options: any): Promise<Category> {
    return await this.categoryModel.findOneAndUpdate({ categoryId }, categoryDto, options).orFail(() => {
      throw new NotFoundException('Category not found.');
    });
  }  
}
