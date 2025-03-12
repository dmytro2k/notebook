import { NextFunction, Response } from 'express';
import { AuthBodySchema, TypedRequest } from '../types';
import { userAuth, userLogin, userRegister } from '../services/auth';
import { StatusCodes } from 'http-status-codes';
import { safeAwait } from '../utils/safeAwait';

export const register = async (req: TypedRequest<AuthBodySchema, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const [error, data] = await safeAwait(userRegister({ userName, userPassword }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.CREATED).json(data);
};

export const login = async (req: TypedRequest<AuthBodySchema, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const [error, data] = await safeAwait(userLogin({ userName, userPassword }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const simplifiedAuth = async (req: TypedRequest<AuthBodySchema, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const [error, data] = await safeAwait(userAuth({ userName, userPassword }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};
