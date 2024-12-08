import { z } from 'zod';
import { User } from '../src/database/Schema';

type User = z.infer<typeof User>;

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
