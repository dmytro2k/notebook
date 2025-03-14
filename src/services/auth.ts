import { AuthBodySchema as AuthProps } from '../types';
import { createUser, getUserByName } from './users';
import { NotFoundError } from '../errors';
import { comparePasswords, createJWT } from '../utils/auth';

export const userRegister = async ({ userName, userPassword }: AuthProps) => {
  const user = await createUser({ userName, userPassword });
  const token = createJWT(user.userId);

  return { token, userId: user.userId, userName: user.userName };
};

export const userLogin = async ({ userName, userPassword }: AuthProps) => {
  const user = await getUserByName({ userName });

  if (!user) {
    throw new NotFoundError('User cannot be found');
  }

  await comparePasswords(userPassword, user.userPassword);

  const token = createJWT(user.userId);
  return { token, userId: user.userId, userName: user.userName };
};

export const userAuth = async ({ userName, userPassword }: AuthProps) => {
  const user = await getUserByName({ userName });

  if (!user) {
    return userRegister({ userName, userPassword });
  }

  return userLogin({ userName, userPassword });
};
