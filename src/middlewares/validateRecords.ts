import { type Request, type Response, type NextFunction } from 'express';
import { countRecords, getRecordFromDb } from '../services/records';
import { TypedRequest } from '../types';
import { CreateRecordBody, RecordParams } from '../types/records';
import { BadRequestError, UnauthenticatedError } from '../errors';

export const checkRecord = async (req: TypedRequest<{}, RecordParams, {}>, res: Response, next: NextFunction) => {
  const { userId } = req.user!;
  const { recordId } = req.params;

  if (!recordId) {
    return next(new BadRequestError('recordId must be provided'));
  }

  const record = await getRecordFromDb({ recordId });

  if (!record) {
    return next(new BadRequestError('There is no such record'));
  }

  if (record.userId !== userId) {
    return next(new UnauthenticatedError('Unauthorized'));
  }

  req.record = record;
  next();
};
