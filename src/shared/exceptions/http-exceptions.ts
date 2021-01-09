import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(error: string | unknown) {
    super({ error, status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(error: string | unknown) {
    super({ error, status: HttpStatus.UNAUTHORIZED }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(error: string | unknown) {
    super({ error, status: HttpStatus.FORBIDDEN }, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(error: string | unknown) {
    super({ error, status: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
  }
}

export class InternalServerError extends HttpException {
  constructor(error: string | unknown) {    
    super({ error, status: HttpStatus.INTERNAL_SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
