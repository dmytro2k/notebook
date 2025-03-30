import { z } from 'zod';
import { Todo, User } from '../src/database/Schema';

type User = z.infer<typeof User>;

declare module 'express' {
  export interface Request {
    user?: User;
    record?: Record;
    todo?: Todo;
  }
}
