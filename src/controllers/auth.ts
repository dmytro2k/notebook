import { NextFunction, Response } from 'express';
import { z } from 'zod';
import { AuthZodSchema } from '../database/Schema';
import { TypedRequest } from '../types';
import { userAuth, userLogin, userRegister } from '../services/auth';
import { StatusCodes } from 'http-status-codes';
import { safeAwait } from '../utils/safeAwait';

type AuthBody = z.infer<typeof AuthZodSchema>;

export const register = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const [error, data] = await safeAwait(userRegister({ userName, userPassword }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.CREATED).json(data);
};

export const login = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const [error, data] = await safeAwait(userLogin({ userName, userPassword }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const simplifiedAuth = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const [error, data] = await safeAwait(userAuth({ userName, userPassword }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};
