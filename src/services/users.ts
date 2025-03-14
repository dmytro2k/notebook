import { DrizzleProvider } from '../database/dbProvider';
import { users } from '../database/Schema';
import { BadRequestError, NotFoundError } from '../errors';
import { hashPassword } from '../utils/auth';
import { eq } from 'drizzle-orm';
import { CreateUserProps, DeleteUserByIdProps, GetUserByIdProps, GetUserByNameProps } from '../types';

export const getUserByName = async ({ userName }: GetUserByNameProps) => {
  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userName, userName));
  return user;
};

export const getUserById = async ({ userId }: GetUserByIdProps) => {
  if (!userId) {
    throw new BadRequestError('There is no user with such id');
  }

  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userId, userId));
  return user;
};

export const deleteUserById = async ({ userId }: DeleteUserByIdProps) => {
  if (!userId) {
    throw new BadRequestError('There is no user with such id');
  }

  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userId, userId));
  if (!user) {
    throw new NotFoundError('Not found such user');
  }

  await DrizzleProvider.getInstance().delete(users).where(eq(users.userId, userId));
};

export const createUser = async ({ userName, userPassword }: CreateUserProps) => {
  const existedUser = await getUserByName({ userName });

  if (existedUser) {
    throw new BadRequestError('Name is already taken');
  }

  const hashedPassword = await hashPassword(userPassword);

  const [user] = await DrizzleProvider.getInstance()
    .insert(users)
    .values({
      userName,
      userPassword: hashedPassword,
    })
    .returning();

  return user;
};
