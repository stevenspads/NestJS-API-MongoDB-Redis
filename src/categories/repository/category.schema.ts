import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false })
export class Category {
  @Prop({ required: false, unique: true, index: true })
  categoryId: number;
  
  @Prop({ required: true, unique: true })
  name: string;  
}

export const CategorySchema = SchemaFactory.createForClass(Category);