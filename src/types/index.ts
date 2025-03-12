import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {
  userInsertZodSchema,
  userUpdateZodSchema,
  todoInsertZodSchema,
  todoUpdateZodSchema,
  recordInsertZodSchema,
  recordUpdateZodSchema,
} from '../database/Schema';

const EmptyZodSchema = z.object({});

interface TypedRequest<BodyType, ParamsType extends ParamsDictionary, QueryType extends ParsedQs> extends Request {
  body: BodyType;
  params: ParamsType;
  query: QueryType;
}

type ControllerFunctionProps = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const AuthZodSchema = userInsertZodSchema.pick({
  userName: true,
  userPassword: true,
});
type AuthBodySchema = z.infer<typeof AuthZodSchema>;

const CreateTodoZodSchema = todoInsertZodSchema.omit({ todoId: true, todoIsDone: true, todoPosition: true });
type CreateTodoBody = z.infer<typeof CreateTodoZodSchema>;

const DeleteTodoZodSchema = todoInsertZodSchema.pick({ userId: true, todoId: true });
type DeleteTodoBody = z.infer<typeof DeleteTodoZodSchema>;

const EditTodoZodSchema = todoUpdateZodSchema.omit({ todoDate: true, todoPosition: true }).required();
type EditTodoBody = z.infer<typeof EditTodoZodSchema>;

const GetDateTodosZodSchema = todoInsertZodSchema.pick({ userId: true, todoDate: true });
type GetDateTodosBody = z.infer<typeof GetDateTodosZodSchema>;

const GetFullTodoZodSchema = todoInsertZodSchema.pick({ userId: true, todoId: true });
type GetFullTodoBody = z.infer<typeof GetFullTodoZodSchema>;

const ChangeTodoPositionZodSchema = todoUpdateZodSchema.pick({ userId: true, todoId: true, todoPosition: true }).required();
type ChangeTodoPositionBody = z.infer<typeof ChangeTodoPositionZodSchema>;

const CreateRecordZodSchema = recordInsertZodSchema.omit({ recordId: true, recordPosition: true });
type CreateRecordBody = z.infer<typeof CreateRecordZodSchema>;

const DeleteRecordZodSchema = recordInsertZodSchema.pick({ userId: true, recordId: true });
type DeleteRecordBody = z.infer<typeof DeleteRecordZodSchema>;

const EditRecordZodSchema = recordUpdateZodSchema.omit({ recordDate: true, recordPosition: true }).required();
type EditRecordBody = z.infer<typeof EditRecordZodSchema>;

const GetDateRecordsZodSchema = recordInsertZodSchema.pick({ userId: true, recordDate: true });
type GetDateRecordsBody = z.infer<typeof GetDateRecordsZodSchema>;

const GetFullRecordZodSchema = recordInsertZodSchema.pick({ userId: true, recordId: true });
type GetFullRecordBody = z.infer<typeof GetFullRecordZodSchema>;

const GetRecordedDatesZodSchema = recordInsertZodSchema.pick({ userId: true });
type GetRecordedDatesBody = z.infer<typeof GetRecordedDatesZodSchema>;

const ChangeRecordPositionZodSchema = recordUpdateZodSchema.pick({ userId: true, recordId: true, recordPosition: true }).required();
type ChangeRecordPositionBody = z.infer<typeof ChangeRecordPositionZodSchema>;

const GetUserByNameZodSchema = userInsertZodSchema.pick({ userName: true });
type GetUserByNameProps = z.infer<typeof GetUserByNameZodSchema>;

const GetUserZodSchema = userInsertZodSchema.pick({ userId: true });
type GetUserByIdProps = z.infer<typeof GetUserZodSchema>;

const DeleteUserZodSchema = userInsertZodSchema.pick({ userId: true });
type DeleteUserByIdProps = z.infer<typeof DeleteUserZodSchema>;

const CreateUserZodSchema = userInsertZodSchema.omit({ userId: true });
type CreateUserProps = z.infer<typeof CreateUserZodSchema>;

export {
  EmptyZodSchema,
  TypedRequest,
  ControllerFunctionProps,
  AuthZodSchema,
  AuthBodySchema,
  CreateTodoZodSchema,
  DeleteTodoZodSchema,
  EditTodoZodSchema,
  GetDateTodosZodSchema,
  GetFullTodoZodSchema,
  ChangeTodoPositionZodSchema,
  CreateTodoBody,
  DeleteTodoBody,
  EditTodoBody,
  GetDateTodosBody,
  GetFullTodoBody,
  ChangeTodoPositionBody,
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetFullRecordZodSchema,
  GetRecordedDatesZodSchema,
  ChangeRecordPositionZodSchema,
  CreateRecordBody,
  DeleteRecordBody,
  EditRecordBody,
  GetDateRecordsBody,
  GetFullRecordBody,
  GetRecordedDatesBody,
  ChangeRecordPositionBody,
  GetUserByNameZodSchema,
  GetUserZodSchema,
  DeleteUserZodSchema,
  CreateUserZodSchema,
  GetUserByNameProps,
  GetUserByIdProps,
  DeleteUserByIdProps,
  CreateUserProps,
};
