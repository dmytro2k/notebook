import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ChangeRecordPositionBody,
  CreateRecordBody,
  DeleteRecordBody,
  EditRecordBody,
  GetDateRecordsBody,
  GetRecordedDatesBody,
  RecordParams,
} from '../types/records';
import { TypedRequest } from '../types';
import {
  createNewRecord,
  deleteRecordById,
  updateRecord,
  getRecordsFromDb,
  getRecordedDatesFromDb,
  changeRecordPosition,
} from '../services/records';
import { getRecordedDatesWithTodosFromDb } from '../services/todos';

export const createRecord = async (req: TypedRequest<CreateRecordBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { recordNote, recordDate, recordPosition } = req.body;

  const record = await createNewRecord({ userId, recordDate, recordNote, recordPosition });

  res.status(StatusCodes.CREATED).json(record);
};

export const deleteRecord = async (req: TypedRequest<DeleteRecordBody, RecordParams, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { recordId, recordDate, recordPosition } = req.record!;

  await deleteRecordById({ userId, recordId, recordDate, recordPosition });

  res.status(StatusCodes.OK).json(req.record!);
};

export const editRecord = async (req: TypedRequest<EditRecordBody, RecordParams, {}>, res: Response, next: NextFunction) => {
  const { recordId } = req.record!;
  const { recordNote } = req.body;

  const record = await updateRecord({ recordNote, recordId });

  res.status(StatusCodes.OK).json(record);
};

export const moveRecord = async (req: TypedRequest<ChangeRecordPositionBody, RecordParams, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { recordId, recordDate, recordPosition: oldRecordPosition } = req.record!;
  const { recordPosition: newRecordPosition } = req.body;

  const record = await changeRecordPosition({ userId, recordId, recordDate, oldRecordPosition, newRecordPosition });

  res.status(StatusCodes.OK).json(record);
};

export const getDateRecords = async (req: TypedRequest<GetDateRecordsBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { recordDate } = req.body;

  const records = await getRecordsFromDb({ recordDate, userId });

  res.status(StatusCodes.OK).json(records);
};

export const getRecordedDates = async (req: TypedRequest<GetRecordedDatesBody, {}, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;

  const recordDates = await getRecordedDatesFromDb({ userId });
  const todoDates = await getRecordedDatesWithTodosFromDb({ userId });

  const dates = [...new Set([...recordDates, ...todoDates])];

  res.status(StatusCodes.OK).json(dates);
};
