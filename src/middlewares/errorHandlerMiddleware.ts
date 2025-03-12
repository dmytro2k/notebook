import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../errors';

export const errorHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ msg: error.message });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
};
