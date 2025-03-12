import express from 'express';
import {
  changeRecordPosition,
  createRecord,
  deleteRecord,
  editRecord,
  getDateRecords,
  getFullRecord,
  getRecordedDates,
} from '../controllers/records';
import { validateData } from '../middlewares/validation';
import {
  ChangeRecordPositionZodSchema,
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetFullRecordZodSchema,
  GetRecordedDatesZodSchema,
} from '../types';

const router = express.Router();

router
  .route('/')
  .post(validateData(CreateRecordZodSchema), createRecord)
  .delete(validateData(DeleteRecordZodSchema), deleteRecord)
  .patch(validateData(EditRecordZodSchema), editRecord);

router.route('/move').post(validateData(ChangeRecordPositionZodSchema), changeRecordPosition);
router.route('/full').post(validateData(GetFullRecordZodSchema), getFullRecord);
router.route('/date').post(validateData(GetDateRecordsZodSchema), getDateRecords);
router.route('/dates').post(validateData(GetRecordedDatesZodSchema), getRecordedDates);

export default router;
