import { z } from 'zod';
import { AuthZodSchema } from '../database/Schema';
import { createUser, getUserByName } from './users';
import { NotFoundError } from '../errors';
import { comparePasswords, createJWT } from '../utils/auth';

type AuthProps = z.infer<typeof AuthZodSchema>;

export const userRegister = async ({ userName, userPassword }: AuthProps) => {
  const user = await createUser({ userName, userPassword });
  const token = createJWT(user.userId);

  return { token, userId: user.userId };
};

export const userLogin = async ({ userName, userPassword }: AuthProps) => {
  const user = await getUserByName({ userName });

  if (!user) {
    throw new NotFoundError('User cannot be found');
  }

  await comparePasswords(userPassword, user.userPassword);

  const token = createJWT(user.userId);
  return { token, userId: user.userId };
};
