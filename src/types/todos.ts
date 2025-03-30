import { z } from 'zod';
import { todoInsertZodSchema, todoUpdateZodSchema } from '../database/Schema';

export const CreateTodoBodyZodSchema = todoInsertZodSchema
  .omit({ userId: true, todoId: true, todoIsDone: true })
  .partial({ todoPosition: true });
export const DeleteTodoBodyZodSchema = todoInsertZodSchema.pick({});
export const EditTodoBodyZodSchema = todoUpdateZodSchema.pick({ todoNote: true, todoIsDone: true }).required();
export const GetDateTodosBodyZodSchema = todoInsertZodSchema.pick({ todoDate: true });
export const ChangeTodoPositionBodyZodSchema = todoUpdateZodSchema.pick({ todoPosition: true }).required();
export const TodoUpdatesBodyZodSchema = todoUpdateZodSchema.pick({ todoNote: true, todoPosition: true, todoIsDone: true });
export const TodoParamsZodSchema = todoInsertZodSchema.pick({ todoId: true });

export type CreateTodoBody = z.infer<typeof CreateTodoBodyZodSchema>;
export type DeleteTodoBody = z.infer<typeof DeleteTodoBodyZodSchema>;
export type EditTodoBody = z.infer<typeof EditTodoBodyZodSchema>;
export type GetDateTodosBody = z.infer<typeof GetDateTodosBodyZodSchema>;
export type ChangeTodoPositionBody = z.infer<typeof ChangeTodoPositionBodyZodSchema>;
export type TodoUpdates = z.infer<typeof TodoUpdatesBodyZodSchema>;
export type TodoParams = z.infer<typeof TodoParamsZodSchema>;
