import { todos } from '../database/Schema';
import { TodoUpdates } from '../types/todos';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq, sql, gt, gte, lte, lt, SQL } from 'drizzle-orm';

type CreateNewTodoProps = {
  userId: string;
  todoNote: string;
  todoDate: string;
  todoPosition?: number;
};

type DeleteTodoByIdProps = {
  userId: string;
  todoId: string;
  todoDate: string;
  todoPosition: number;
};

type UpdateTodoProps = {
  todoId: string;
  todoNote: string;
  todoIsDone: boolean;
};

type ChangeTodoPositionProps = {
  userId: string;
  todoId: string;
  todoDate: string;
  oldTodoPosition: number;
  newTodoPosition: number;
};

type GetTodosFromDbProps = {
  userId: string;
  todoDate: string;
};

type GetTodoFromDbProps = {
  todoId: string;
};

type GetRecordedDatesWithTodosFromDbProps = {
  userId: string;
};

type CountTodosProps = {
  userId: string;
  todoDate: string;
};

type ShiftTodosPositionInDbProps = {
  filter: SQL | undefined;
  shift: number;
};

type InsertNewTodoInDbProps = {
  userId: string;
  todoDate: string;
  todoNote: string;
  todoPosition: number;
};

type UpdateTodoInDbProps = {
  todoId: string;
  todoUpdates: TodoUpdates;
};

type DeleteTodoFromDbProps = {
  todoId: string;
};

export const createNewTodo = async ({ userId, todoNote, todoDate, todoPosition }: CreateNewTodoProps) => {
  const todosLength = await countTodos({ userId, todoDate });

  if ((!todoPosition && todoPosition != 0) || todoPosition > todosLength) {
    todoPosition = todosLength;
  }

  await shiftTodosPositionInDb({
    filter: and(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)), gte(todos.todoPosition, todoPosition)),
    shift: 1,
  });

  const [todo] = await DrizzleProvider.getInstance().insert(todos).values({ userId, todoNote, todoDate, todoPosition }).returning();
  return todo;
};

export const deleteTodoById = async ({ userId, todoId, todoDate, todoPosition }: DeleteTodoByIdProps) => {
  await DrizzleProvider.getInstance().delete(todos).where(eq(todos.todoId, todoId));
  await shiftTodosPositionInDb({
    filter: and(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)), gt(todos.todoPosition, todoPosition)),
    shift: -1,
  });
};

export const updateTodo = async ({ todoId, todoNote, todoIsDone }: UpdateTodoProps) => {
  return updateTodoInDb({ todoId, todoUpdates: { todoNote, todoIsDone } });
};

export const changeTodoPosition = async ({ userId, todoId, todoDate, oldTodoPosition, newTodoPosition }: ChangeTodoPositionProps) => {
  if (oldTodoPosition < newTodoPosition) {
    await shiftTodosPositionInDb({
      filter: and(
        and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)),
        and(gte(todos.todoPosition, newTodoPosition), lt(todos.todoPosition, oldTodoPosition))
      ),
      shift: 1,
    });
  } else {
    await shiftTodosPositionInDb({
      filter: and(
        and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)),
        and(gt(todos.todoPosition, oldTodoPosition), lte(todos.todoPosition, newTodoPosition))
      ),
      shift: -1,
    });
  }

  return updateTodoInDb({ todoId, todoUpdates: { todoPosition: newTodoPosition } });
};

export const getTodosFromDb = async ({ userId, todoDate }: GetTodosFromDbProps) => {
  const dateTodos = await DrizzleProvider.getInstance()
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)))
    .orderBy(todos.todoPosition);

  return dateTodos;
};

export const getTodoFromDb = async ({ todoId }: GetTodoFromDbProps) => {
  const [todo] = await DrizzleProvider.getInstance().select().from(todos).where(eq(todos.todoId, todoId));

  return todo;
};

export const getRecordedDatesWithTodosFromDb = async ({ userId }: GetRecordedDatesWithTodosFromDbProps) => {
  const dates = await DrizzleProvider.getInstance()
    .selectDistinct({
      date: todos.todoDate,
    })
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(todos.todoDate);

  return dates;
};

export const countTodos = async ({ userId, todoDate }: CountTodosProps) => {
  const [todosLength] = await DrizzleProvider.getInstance()
    .select({ count: sql<number>`COUNT(*)` })
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.todoDate, todoDate)));
  return todosLength.count;
};

export const shiftTodosPositionInDb = async ({ filter, shift }: ShiftTodosPositionInDbProps) => {
  return DrizzleProvider.getInstance()
    .update(todos)
    .set({ todoPosition: sql`${todos.todoPosition} + ${shift}` })
    .where(filter);
};

export const insertNewTodoInDb = async ({ userId, todoDate, todoNote, todoPosition }: InsertNewTodoInDbProps) => {
  const [todo] = await DrizzleProvider.getInstance().insert(todos).values({ userId, todoNote, todoDate, todoPosition }).returning();
  return todo;
};

export const updateTodoInDb = async ({ todoId, todoUpdates }: UpdateTodoInDbProps) => {
  const [updatedTodo] = await DrizzleProvider.getInstance().update(todos).set(todoUpdates).where(eq(todos.todoId, todoId)).returning();

  return updatedTodo;
};

export const deleteTodoFromDb = async ({ todoId }: DeleteTodoFromDbProps) => {
  return DrizzleProvider.getInstance().delete(todos).where(eq(todos.todoId, todoId));
};
