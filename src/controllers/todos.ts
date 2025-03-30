import { ChangeTodoPositionBody, CreateTodoBody, DeleteTodoBody, EditTodoBody, GetDateTodosBody, TodoParams } from '../types/todos';
import { StatusCodes } from 'http-status-codes';
import { TypedRequest } from '../types';
import { Response, NextFunction } from 'express';
import { changeTodoPosition, createNewTodo, deleteTodoById, getTodosFromDb, updateTodo } from '../services/todos';

export const createTodo = async (req: TypedRequest<CreateTodoBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { todoNote, todoDate, todoPosition } = req.body;

  const todo = await createNewTodo({ userId, todoNote, todoDate, todoPosition });

  res.status(StatusCodes.CREATED).json(todo);
};

export const deleteTodo = async (req: TypedRequest<DeleteTodoBody, TodoParams, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { todoId, todoDate, todoPosition } = req.todo!;

  await deleteTodoById({ userId, todoId, todoDate, todoPosition });

  res.status(StatusCodes.OK).json(req.todo!);
};

export const editTodo = async (req: TypedRequest<EditTodoBody, TodoParams, {}>, res: Response, next: NextFunction) => {
  const { todoId } = req.todo!;
  const { todoNote, todoIsDone } = req.body;

  const todo = await updateTodo({ todoId, todoNote, todoIsDone });

  res.status(StatusCodes.OK).json(todo);
};

export const moveTodo = async (req: TypedRequest<ChangeTodoPositionBody, TodoParams, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { todoId, todoDate, todoPosition: oldTodoPosition } = req.todo!;
  const { todoPosition: newTodoPosition } = req.body;

  const todo = await changeTodoPosition({ userId, todoId, todoDate, oldTodoPosition, newTodoPosition });

  res.status(StatusCodes.OK).json(todo);
};

export const getDateTodos = async (req: TypedRequest<GetDateTodosBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { todoDate } = req.body;

  const todos = await getTodosFromDb({ userId, todoDate });

  res.status(StatusCodes.OK).json(todos);
};
