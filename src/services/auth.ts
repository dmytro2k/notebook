import { AuthBody as AuthProps } from '../types/user';
import { insertUserInDb, getUserByNameFromDb } from './users';
import { comparePasswords, createJWT } from '../utils/auth';

export const userRegister = async ({ userName, userPassword }: AuthProps) => {
  const user = await insertUserInDb({ userName, userPassword });
  const token = createJWT(user.userId);

  return { token, userId: user.userId, userName: user.userName };
};

export const userLogin = async ({ userName, userPassword }: AuthProps) => {
  const user = await getUserByNameFromDb({ userName });

  await comparePasswords(userPassword, user.userPassword);

  const token = createJWT(user.userId);
  return { token, userId: user.userId, userName: user.userName };
};
