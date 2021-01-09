import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = BlogPost & Document;

@Schema({ timestamps: true, versionKey: false })
export class BlogPost {
  @Prop({ required: false, unique: true, index: true })
  postId: number;
  
  @Prop({ required: true })
  date: Date;
  
  @Prop({ required: true, unique: true })
  title: string;  

  @Prop({ required: true })
  body: string;  

  @Prop({ required: true, index: true })
  categoryId: number;
}

export const PostSchema = SchemaFactory.createForClass(BlogPost);
