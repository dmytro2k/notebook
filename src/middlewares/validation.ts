import { Request, Response, NextFunction } from 'express';
import { ZodError, AnyZodObject } from 'zod';
import { BadRequestError, InternalServerError } from '../errors';
import { EmptyZodSchema } from '../interfaces';

export const validateData = (bodyZodSchema: AnyZodObject, paramsZodSchema: AnyZodObject = EmptyZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      bodyZodSchema.parse(req.body);
      paramsZodSchema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.message);

        throw new BadRequestError('Invalid data');
      } else {
        throw new InternalServerError('Internal Server Error');
      }
    }
  };
};
