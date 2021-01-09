import { ApiProperty } from "@nestjs/swagger";
import { Category } from "categories/repository/category.schema";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from "class-validator";

export class PostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()  
  title: string;
  @ApiProperty()  
  @IsString() 
  author?: string;
  @ApiProperty() 
  @IsNotEmpty() 
  @IsDate() 
  date: Date;
  @ApiProperty()  
  @IsNotEmpty()
  @IsString() 
  body: string;  
  @ApiProperty()  
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => Category) 
  category: Category;
}
