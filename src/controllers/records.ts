import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetTimeRecordsZodSchema,
  GetFullRecordZodSchema,
} from '../database/Schema';
import { TypedRequest } from '../types';
import { z } from 'zod';
import { safeAwait } from '../utils/safeAwait';
import { createNewRecord, deleteRecordById, updateRecord, getRecordsByDate, getRecordsByTime, getRecordById } from '../services/records';
import { UnauthenticatedError } from '../errors';

type CreateRecordBody = z.infer<typeof CreateRecordZodSchema>;
type DeleteRecordBody = z.infer<typeof DeleteRecordZodSchema>;
type EditRecordBody = z.infer<typeof EditRecordZodSchema>;
type GetDateRecordsBody = z.infer<typeof GetDateRecordsZodSchema>;
type GetTimeRecordsBody = z.infer<typeof GetTimeRecordsZodSchema>;
type GetFullRecordBody = z.infer<typeof GetFullRecordZodSchema>;

export const createRecord = async (req: TypedRequest<CreateRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { recordNote, userId, recordDate, recordTime } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(createNewRecord({ recordNote, userId, recordDate, recordTime }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.CREATED).json(data);
};

export const deleteRecord = async (req: TypedRequest<DeleteRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, recordId } = req.body;
  const [error, _] = await safeAwait(deleteRecordById({ userId, recordId }));

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.NO_CONTENT).json();
};

export const editRecord = async (req: TypedRequest<EditRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { recordNote, userId, recordTime, recordId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(updateRecord({ recordNote, userId, recordTime, recordId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getDateRecords = async (req: TypedRequest<GetDateRecordsBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { recordDate, userId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getRecordsByDate({ recordDate, userId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getTimeRecords = async (req: TypedRequest<GetTimeRecordsBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { recordDate, recordTime, userId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getRecordsByTime({ recordDate, recordTime, userId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getFullRecord = async (req: TypedRequest<GetFullRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { recordId, userId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getRecordById({ recordId, userId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};
