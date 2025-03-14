import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception?.message?.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          message,
          error: 'Record Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        });
        break;
      case 'P2002':
        response.status(HttpStatus.CONFLICT).json({
          message,
          error: 'Unique Constraint Failed',
          statusCode: HttpStatus.CONFLICT,
        });
        break;
      // TODO Error code is not correct
      case 'P2006':
        response.status(HttpStatus.CONFLICT).json({
          message,
          error: 'Provided value is not valid',
          statusCode: HttpStatus.BAD_REQUEST,
        });
        break;
      // Add More Prisma client exception if it's needed
      default:
        super.catch(exception, host);
        break;
    }
  }
}
