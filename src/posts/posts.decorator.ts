import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IsInt, IsNotEmpty, validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { DecoratorHelper } from './../shared/helpers/decorator.helper';

export class PostParam {
  @IsNotEmpty()
  @IsInt()
  @Transform(value => value && parseInt(value, 10))
  postId: number;
}

export const getPostParam: any = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return getPostParamFactoryFunction(data, request);
});

export async function getPostParamFactoryFunction(data: string, request: Request) {
  const parameters: PostParam = new PostParam();

  parameters.postId = DecoratorHelper.getNumberParameter('postId', request);
  
  const errors = await validate(parameters);

  if (errors.length > 0) {
    DecoratorHelper.handleValidationErrors(errors);
  }

  return data && parameters[data] ? parameters[data] : parameters;
}
