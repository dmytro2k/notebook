import { z } from 'zod';
import {
  CreateTodoZodSchema,
  DeleteTodoZodSchema,
  EditTodoZodSchema,
  GetDateTodosZodSchema,
  GetFullTodoZodSchema,
} from '../database/Schema';
import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError } from '../errors';
import { safeAwait } from '../utils/safeAwait';
import { TypedRequest } from '../types';
import { Response, NextFunction } from 'express';
import { createNewTodo, deleteTodoById, getTodoById, getTodosByDate, updateTodo } from '../services/todos';

type CreateTodoBody = z.infer<typeof CreateTodoZodSchema>;
type DeleteTodoBody = z.infer<typeof DeleteTodoZodSchema>;
type EditTodoBody = z.infer<typeof EditTodoZodSchema>;
type GetDateTodosBody = z.infer<typeof GetDateTodosZodSchema>;
type GetFullTodoBody = z.infer<typeof GetFullTodoZodSchema>;

export const createTodo = async (req: TypedRequest<CreateTodoBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, todoNote, todoDate } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(createNewTodo({ userId, todoNote, todoDate }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.CREATED).json(data);
};

export const deleteTodo = async (req: TypedRequest<DeleteTodoBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, todoId } = req.body;
  const [error, _] = await safeAwait(deleteTodoById({ userId, todoId }));

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.NO_CONTENT).json();
};

export const editTodo = async (req: TypedRequest<EditTodoBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, todoId, todoNote, todoIsDone } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(updateTodo({ userId, todoId, todoNote, todoIsDone }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getDateTodos = async (req: TypedRequest<GetDateTodosBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, todoDate } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getTodosByDate({ userId, todoDate }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getFullTodo = async (req: TypedRequest<GetFullTodoBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, todoId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getTodoById({ userId, todoId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};
