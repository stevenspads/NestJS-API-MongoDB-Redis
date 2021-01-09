import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IsInt, IsNotEmpty, validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { DecoratorHelper } from './../shared/helpers/decorator.helper';

export class CategoryParam {
  @IsNotEmpty()
  @IsInt()
  @Transform(value => value && parseInt(value, 10))
  categoryId: number;
}

export const getCategoryParam: any = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return getCategoryParamFactoryFunction(data, request);
});

export async function getCategoryParamFactoryFunction(data: string, request: Request) {
  const parameters: CategoryParam = new CategoryParam();

  parameters.categoryId = DecoratorHelper.getNumberParameter('categoryId', request);
  
  const errors = await validate(parameters);

  if (errors.length > 0) {
    DecoratorHelper.handleValidationErrors(errors);
  }

  return data && parameters[data] ? parameters[data] : parameters;
}
