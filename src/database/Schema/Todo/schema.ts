import { date, boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { users } from '../index';

export const todos = pgTable('todos', {
  todoId: uuid('todo_id').defaultRandom().primaryKey(),
  todoNote: text('todo_note').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
  todoDate: date().notNull(),
  todoIsDone: boolean().notNull().default(false),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: false }).notNull().defaultNow(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  author: one(users, {
    fields: [todos.userId],
    references: [users.userId],
  }),
}));

export type Todo = InferSelectModel<typeof todos>;
export type NewTodo = InferInsertModel<typeof todos>;

export const CreateTodoZodSchema = createInsertSchema(todos)
  .pick({
    userId: true,
    todoDate: true,
    todoNote: true,
  })
  .required();

export const DeleteTodoZodSchema = createInsertSchema(todos)
  .pick({
    userId: true,
    todoId: true,
  })
  .required();

export const EditTodoZodSchema = createUpdateSchema(todos)
  .pick({
    userId: true,
    todoId: true,
    todoNote: true,
    todoIsDone: true,
  })
  .required();

export const GetDateTodosZodSchema = createInsertSchema(todos)
  .pick({
    userId: true,
    todoDate: true,
  })
  .required();

export const GetFullTodoZodSchema = createInsertSchema(todos)
  .pick({
    userId: true,
    todoId: true,
  })
  .required();

export const GetRecordedDatesWithTodosZodSchema = createInsertSchema(todos).pick({ userId: true }).required();
