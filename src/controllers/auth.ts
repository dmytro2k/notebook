import { NextFunction, Response } from 'express';
import { TypedRequest } from '../types';
import { userLogin, userRegister } from '../services/auth';
import { StatusCodes } from 'http-status-codes';
import { safeAwait } from '../utils/safeAwait';
import { AuthBody } from '../types/user';

export const register = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const user = await userRegister({ userName, userPassword });

  res.status(StatusCodes.CREATED).json(user);
};

export const login = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName, userPassword } = req.body;
  const user = await userLogin({ userName, userPassword });

  res.status(StatusCodes.OK).json(user);
};
