import { type Response, type NextFunction } from 'express';
import { TypedRequest } from '../types';
import { AuthBody } from '../types/user';
import { getUserByNameFromDb } from '../services/users';
import { BadRequestError, NotFoundError } from '../errors';

export const checkUserForLogin = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName } = req.body;

  const existedUser = await getUserByNameFromDb({ userName });

  if (!existedUser) {
    throw new NotFoundError('User cannot be found');
  }

  next();
};

export const checkUserForRegister = async (req: TypedRequest<AuthBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userName } = req.body;

  const existedUser = await getUserByNameFromDb({ userName });

  if (!!existedUser) {
    return next(new BadRequestError('Name is already taken'));
  }

  next();
};
