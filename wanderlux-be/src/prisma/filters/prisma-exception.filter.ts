import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IErrorResponse } from '../../common/types/error.response';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        response
          .status(HttpStatus.CONFLICT)
          .json(this.getUniqueConstraintBody(exception));
        break;
      default:
        console.error('An unknown prisma client exception occurred');
        console.error(exception);
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
    }
  }

  private getUniqueConstraintBody(
    exception: PrismaClientKnownRequestError,
  ): IErrorResponse {
    const modelName = exception.meta?.modelName as string | '';
    const target: string[] = (exception.meta?.target as string[]) || [];
    let message: string = 'A unique constraint was violated';
    switch (modelName) {
      case 'User':
        if (target && target.includes('email')) {
          message = 'An account with this email address already exists';
        } else {
          console.error(
            "A unique constraint on the User was violated, but there isn't an assigned message for it",
          );
          console.error(exception);
        }
        break;
      default:
        console.error('An unknown unique constraint was violated');
        console.error(exception);
    }
    return { message };
  }
}
