import { z } from 'zod';
import { userInsertZodSchema, userUpdateZodSchema } from '../database/Schema';

export const AuthZodSchema = userInsertZodSchema.pick({
  userName: true,
  userPassword: true,
});
export const GetUserByNameZodSchema = userInsertZodSchema.pick({ userName: true });
export const GetUserZodSchema = userInsertZodSchema.pick({ userId: true });
export const DeleteUserZodSchema = userInsertZodSchema.pick({ userId: true });
export const CreateUserZodSchema = userInsertZodSchema.omit({ userId: true });

export type AuthBody = z.infer<typeof AuthZodSchema>;
export type GetUserByNameProps = z.infer<typeof GetUserByNameZodSchema>;
export type GetUserByIdProps = z.infer<typeof GetUserZodSchema>;
export type DeleteUserByIdProps = z.infer<typeof DeleteUserZodSchema>;
export type CreateUserProps = z.infer<typeof CreateUserZodSchema>;
