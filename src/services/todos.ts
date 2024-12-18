import { z } from 'zod';
import {
  CreateTodoZodSchema,
  DeleteTodoZodSchema,
  EditTodoZodSchema,
  GetDateTodosZodSchema,
  GetFullTodoZodSchema,
  GetRecordedDatesWithTodosZodSchema,
  todos,
} from '../database/Schema';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq } from 'drizzle-orm';
import { BadRequestError, UnauthenticatedError } from '../errors';

type CreateNewTodoProps = z.infer<typeof CreateTodoZodSchema>;
type DeleteTodoByIdProps = z.infer<typeof DeleteTodoZodSchema>;
type UpdateTodoProps = z.infer<typeof EditTodoZodSchema>;
type GetTodosByDateProps = z.infer<typeof GetDateTodosZodSchema>;
type GetTodoByIdProps = z.infer<typeof GetFullTodoZodSchema>;
type GetRecordedDatesWithTodosProps = z.infer<typeof GetRecordedDatesWithTodosZodSchema>;

export const createNewTodo = async ({ userId, todoNote, todoDate }: CreateNewTodoProps) => {
  const [todo] = await DrizzleProvider.getInstance().insert(todos).values({ userId, todoNote, todoDate }).returning();
  return todo;
};

export const deleteTodoById = async ({ userId, todoId }: DeleteTodoByIdProps) => {
  const [todo] = await DrizzleProvider.getInstance().select().from(todos).where(eq(todos.todoId, todoId));

  if (!todo) {
    throw new BadRequestError('There is no such todo');
  }

  if (todo.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  await DrizzleProvider.getInstance().delete(todos).where(eq(todos.todoId, todoId));
};

export const updateTodo = async ({ userId, todoId, todoNote, todoIsDone }: UpdateTodoProps) => {
  const [todo] = await DrizzleProvider.getInstance().select().from(todos).where(eq(todos.todoId, todoId));

  if (!todo) {
    throw new BadRequestError('There is no such record');
  }

  if (todo.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  const [updatedTodo] = await DrizzleProvider.getInstance()
    .update(todos)
    .set({ todoNote, todoIsDone })
    .where(eq(todos.todoId, todoId))
    .returning();

  return updatedTodo;
};

export const getTodosByDate = async ({ userId, todoDate }: GetTodosByDateProps) => {
  const dateTodos = await DrizzleProvider.getInstance()
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)))
    .orderBy(todos.todoDate, todos.createdAt);

  return dateTodos;
};

export const getTodoById = async ({ todoId, userId }: GetTodoByIdProps) => {
  const [todo] = await DrizzleProvider.getInstance().select().from(todos).where(eq(todos.todoId, todoId));

  if (!todo) {
    throw new BadRequestError('There is no such record');
  }

  if (todo.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  return todo;
};

export const getRecordedDatesWithTodos = async ({ userId }: GetRecordedDatesWithTodosProps) => {
  const dates = await DrizzleProvider.getInstance()
    .selectDistinct({
      date: todos.todoDate,
    })
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(todos.todoDate);

  return dates;
};
