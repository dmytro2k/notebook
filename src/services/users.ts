import { DrizzleProvider } from '../database/dbProvider';
import { users } from '../database/Schema';
import { BadRequestError, NotFoundError } from '../errors';
import { createJWT, hashPassword } from '../utils/auth';
import { eq } from 'drizzle-orm';

type GetUserByNameProps = {
  userName: string;
};

type GetUserByIdProps = {
  userId: string;
};

type DeleteUserByIdProps = {
  userId: string;
};

type CreateUserProps = {
  userName: string;
  userPassword: string;
};

export const getUserByName = async ({ userName }: GetUserByNameProps) => {
  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userName, userName));
  return user;
};

export const getUserById = async ({ userId }: GetUserByIdProps) => {
  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userId, userId));
  return user;
};

export const deleteUserById = async ({ userId }: DeleteUserByIdProps) => {
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
