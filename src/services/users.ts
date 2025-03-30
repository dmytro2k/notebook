import { DrizzleProvider } from '../database/dbProvider';
import { users } from '../database/Schema';
import { BadRequestError, NotFoundError } from '../errors';
import { hashPassword } from '../utils/auth';
import { eq } from 'drizzle-orm';

type GetUserByNameFromDbProps = {
  userName: string;
};

type GetUserFromDbProps = {
  userId: string;
};

type DeleteUserFromDbProps = {
  userId: string;
};

type CreateUserProps = {
  userName: string;
  userPassword: string;
};

export const getUserByNameFromDb = async ({ userName }: GetUserByNameFromDbProps) => {
  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userName, userName));
  return user;
};

export const getUserFromDb = async ({ userId }: GetUserFromDbProps) => {
  const [user] = await DrizzleProvider.getInstance().select().from(users).where(eq(users.userId, userId));
  return user;
};

export const deleteUserFromDb = async ({ userId }: DeleteUserFromDbProps) => {
  await DrizzleProvider.getInstance().delete(users).where(eq(users.userId, userId));
};

export const insertUserInDb = async ({ userName, userPassword }: CreateUserProps) => {
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
