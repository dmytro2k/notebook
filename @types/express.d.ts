import { z } from 'zod';
import { UserZodSchema } from '../src/interfaces/index';

type User = z.infer<typeof UserZodSchema>;

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
