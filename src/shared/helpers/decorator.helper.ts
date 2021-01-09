import { ValidationError } from "class-validator";
import { Request } from "express";
import { BadRequestException } from "./../../shared/exceptions/http-exceptions";

export class DecoratorHelper {
  public static getNumberParameter(param: string, request: Request): number {
    return parseInt(DecoratorHelper.getStringParameter(param, request), 10);
  }
  
  public static getStringParameter(param: string, request: Request): string {
    return request?.params[param]?.toString();
  }
  
  public static handleValidationErrors(errors: Array<ValidationError>) {
    let reasons = '';
    errors.map((error) => {
      Object.values(error.constraints).map((reason) => {
        reasons += `${reason},`;
      });
    });
    throw new BadRequestException(`Validation failed: ${reasons.slice(0, -1)}`);
  }
}