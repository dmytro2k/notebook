import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ChangeRecordPositionBody,
  CreateRecordBody,
  DeleteRecordBody,
  EditRecordBody,
  GetDateRecordsBody,
  GetFullRecordBody,
  GetRecordedDatesBody,
} from '../types';
import { TypedRequest } from '../types';
import { safeAwait } from '../utils/safeAwait';
import {
  createNewRecord,
  deleteRecordById,
  updateRecord,
  getRecordsByDate,
  getRecordById,
  getRecordedDatesByUser,
  changeRecordPositionById,
} from '../services/records';
import { UnauthenticatedError } from '../errors';
import { getRecordedDatesWithTodos } from '../services/todos';

export const createRecord = async (req: TypedRequest<CreateRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { recordNote, userId, recordDate } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(createNewRecord({ recordNote, userId, recordDate }));

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
  const { recordNote, userId, recordId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(updateRecord({ recordNote, userId, recordId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const changeRecordPosition = async (req: TypedRequest<ChangeRecordPositionBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, recordId, recordPosition } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(changeRecordPositionById({ userId, recordId, recordPosition }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getDateRecords = async (req: TypedRequest<GetDateRecordsBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, recordDate } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getRecordsByDate({ recordDate, userId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getFullRecord = async (req: TypedRequest<GetFullRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId, recordId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [error, data] = await safeAwait(getRecordById({ userId, recordId }));

  if (error) {
    return next(error);
  }

  res.status(StatusCodes.OK).json(data);
};

export const getRecordedDates = async (req: TypedRequest<GetRecordedDatesBody, {}, {}>, res: Response, next: NextFunction) => {
  const { user } = req;
  const { userId } = req.body;

  if (!user || user.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  const [recordError, recordData] = await safeAwait(getRecordedDatesByUser({ userId }));
  const [todoError, todoData] = await safeAwait(getRecordedDatesWithTodos({ userId }));

  if (recordError) {
    return next(recordError);
  }

  if (todoError) {
    return next(todoError);
  }

  const data = [...new Set([...recordData, ...todoData])];

  res.status(StatusCodes.OK).json(data);
};
