import { type Request, type Response, type NextFunction } from 'express';
import { TypedRequest } from '../types';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { CreateTodoBody, TodoParams } from '../types/todos';
import { countTodos, getTodoFromDb } from '../services/todos';

export const checkTodo = async (req: TypedRequest<{}, TodoParams, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { todoId } = req.params;

  if (!todoId) {
    return next(new BadRequestError('todoId must be provided'));
  }

  const todo = await getTodoFromDb({ todoId });

  if (!todo) {
    return next(new BadRequestError('There is no such todo'));
  }

  if (todo.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  req.todo = todo;
  next();
};
