import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetTimeRecordsZodSchema,
  GetFullRecordZodSchema,
} from '../database/Schema';
import { TypedRequest } from '../interfaces';
import { z } from 'zod';

type CreateRecordBody = z.infer<typeof CreateRecordZodSchema>;
type DeleteRecordBody = z.infer<typeof DeleteRecordZodSchema>;
type EditRecordBody = z.infer<typeof EditRecordZodSchema>;
type GetDateRecordsBody = z.infer<typeof GetDateRecordsZodSchema>;
type GetTimeRecordsZodSchemaBody = z.infer<typeof GetTimeRecordsZodSchema>;
type GetFullRecordZodSchemaBody = z.infer<typeof GetFullRecordZodSchema>;

export const createRecord = async (req: TypedRequest<CreateRecordBody, {}, {}>, res: Response) => {};

export const deleteRecord = async (req: TypedRequest<DeleteRecordBody, {}, {}>, res: Response) => {};

export const editRecord = async (req: TypedRequest<EditRecordBody, {}, {}>, res: Response) => {};

export const getDateRecords = async (req: TypedRequest<GetDateRecordsBody, {}, {}>, res: Response) => {};

export const getTimeRecords = async (req: TypedRequest<GetTimeRecordsZodSchemaBody, {}, {}>, res: Response) => {};

export const getFullRecord = async (req: TypedRequest<GetFullRecordZodSchemaBody, {}, {}>, res: Response) => {};
