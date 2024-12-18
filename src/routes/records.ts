import express from 'express';
import {
  createRecord,
  deleteRecord,
  editRecord,
  getDateRecords,
  getFullRecord,
  getRecordedDates,
  getTimeRecords,
} from '../controllers/records';
import { validateData } from '../middlewares/validation';
import {
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetFullRecordZodSchema,
  GetRecordedDatesZodSchema,
  GetTimeRecordsZodSchema,
} from '../database/Schema';

const router = express.Router();

router
  .route('/')
  .post(validateData(CreateRecordZodSchema), createRecord)
  .delete(validateData(DeleteRecordZodSchema), deleteRecord)
  .patch(validateData(EditRecordZodSchema), editRecord);

router.route('/full').post(validateData(GetFullRecordZodSchema), getFullRecord);
router.route('/dated').post(validateData(GetDateRecordsZodSchema), getDateRecords);
router.route('/timed').post(validateData(GetTimeRecordsZodSchema), getTimeRecords);
router.route('/dates').post(validateData(GetRecordedDatesZodSchema), getRecordedDates);

export default router;
