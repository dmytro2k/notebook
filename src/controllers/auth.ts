import { Response } from 'express';
import { asyncWrapper } from '../middlewares/asyncWrapper';
import { z } from 'zod';
import { AuthZodSchema } from '../database/Schema';
import { TypedRequest } from '../interfaces';

type AuthBody = z.infer<typeof AuthZodSchema>;

export const register = asyncWrapper(async (req: TypedRequest<AuthBody, {}, {}>, res: Response) => {
  const result = AuthZodSchema.safeParse(req.body);

  if (!result.success) {
  }
});

export const login = asyncWrapper(async (req: TypedRequest<AuthBody, {}, {}>, res: Response) => {});
