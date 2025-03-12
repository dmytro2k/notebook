import { z } from 'zod';
import { todos, todoInsertZodSchema } from '../database/Schema';
import {
  CreateTodoBody as CreateNewTodoProps,
  DeleteTodoBody as DeleteTodoByIdProps,
  EditTodoBody as UpdateTodoProps,
  GetDateTodosBody as GetTodosByDateProps,
  GetFullTodoBody as GetTodoByIdProps,
  ChangeTodoPositionBody as ChangeTodoPositionByIdProps,
} from '../types';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq, sql, gt, gte, lte, lt } from 'drizzle-orm';
import { BadRequestError, UnauthenticatedError } from '../errors';

const GetRecordedDatesWithTodosZodSchema = todoInsertZodSchema.pick({ userId: true });
type GetRecordedDatesWithTodosProps = z.infer<typeof GetRecordedDatesWithTodosZodSchema>;

const GetTodoLengthZodSchema = todoInsertZodSchema.pick({ userId: true, todoDate: true });
type GetTodosLengthProps = z.infer<typeof GetTodoLengthZodSchema>;

export const createNewTodo = async ({ userId, todoNote, todoDate }: CreateNewTodoProps) => {
  const todosLength = await getTodosLength({ userId, todoDate });
  const todoPosition = todosLength + 1;

  const [todo] = await DrizzleProvider.getInstance().insert(todos).values({ userId, todoNote, todoDate, todoPosition }).returning();
  return todo;
};

export const deleteTodoById = async ({ userId, todoId }: DeleteTodoByIdProps) => {
  if (!todoId) {
    throw new BadRequestError('There is no todo with such id');
  }

  const [todo] = await DrizzleProvider.getInstance().select().from(todos).where(eq(todos.todoId, todoId));

  if (!todo) {
    throw new BadRequestError('There is no such todo');
  }

  if (todo.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  await DrizzleProvider.getInstance().delete(todos).where(eq(todos.todoId, todoId));
  await DrizzleProvider.getInstance()
    .update(todos)
    .set({ todoPosition: sql<number>`todoPosition - 1` })
    .where(and(and(eq(todos.userId, userId), eq(todos.todoDate, todo.todoDate)), gt(todos.todoPosition, todo.todoPosition)));
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

export const changeTodoPositionById = async ({ userId, todoId, todoPosition: newTodoPosition }: ChangeTodoPositionByIdProps) => {
  const [todo] = await DrizzleProvider.getInstance().select().from(todos).where(eq(todos.todoId, todoId));

  if (!todo) {
    throw new BadRequestError('There is no such todo');
  }

  if (todo.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  const oldTodoPosition = todo.todoPosition;

  await DrizzleProvider.getInstance()
    .update(todos)
    .set({ todoPosition: sql<number>`-1` })
    .where(eq(todos.todoId, todoId));

  if (oldTodoPosition < newTodoPosition) {
    await DrizzleProvider.getInstance()
      .update(todos)
      .set({ todoPosition: sql<number>`todoPosition + 1` })
      .where(
        and(
          and(eq(todos.userId, userId), eq(todos.todoDate, todo.todoDate)),
          and(gte(todos.todoPosition, newTodoPosition), lt(todos.todoPosition, oldTodoPosition))
        )
      );
  } else {
    await DrizzleProvider.getInstance()
      .update(todos)
      .set({ todoPosition: sql<number>`todoPosition - 1` })
      .where(
        and(
          and(eq(todos.userId, userId), eq(todos.todoDate, todo.todoDate)),
          and(gt(todos.todoPosition, oldTodoPosition), lte(todos.todoPosition, newTodoPosition))
        )
      );
  }

  const [updatedTodo] = await DrizzleProvider.getInstance()
    .update(todos)
    .set({ todoPosition: newTodoPosition })
    .where(eq(todos.todoId, todoId))
    .returning();

  return updatedTodo;
};

export const getTodosByDate = async ({ userId, todoDate }: GetTodosByDateProps) => {
  const dateTodos = await DrizzleProvider.getInstance()
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)))
    .orderBy(todos.todoDate);

  return dateTodos;
};

export const getTodoById = async ({ todoId, userId }: GetTodoByIdProps) => {
  if (!todoId) {
    throw new BadRequestError('There is no todo with such id');
  }

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

const getTodosLength = async ({ userId, todoDate }: GetTodosLengthProps) => {
  const [todosLength] = await DrizzleProvider.getInstance()
    .select({ count: sql<number>`COUNT(*)` })
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)));
  return todosLength.count;
};
