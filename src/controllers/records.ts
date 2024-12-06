import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncWrapper } from '../middlewares/asyncWrapper';
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

export const createRecord = asyncWrapper(async (req: TypedRequest<CreateRecordBody, {}, {}>, res: Response) => {});

export const deleteRecord = asyncWrapper(async (req: TypedRequest<DeleteRecordBody, {}, {}>, res: Response) => {});

export const editRecord = asyncWrapper(async (req: TypedRequest<EditRecordBody, {}, {}>, res: Response) => {});

export const getDateRecords = asyncWrapper(async (req: TypedRequest<GetDateRecordsBody, {}, {}>, res: Response) => {});

export const getTimeRecords = asyncWrapper(async (req: TypedRequest<GetTimeRecordsZodSchemaBody, {}, {}>, res: Response) => {});

export const getFullRecord = asyncWrapper(async (req: TypedRequest<GetFullRecordZodSchemaBody, {}, {}>, res: Response) => {});
