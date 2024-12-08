import express from 'express';
import { createRecord, deleteRecord, editRecord, getDateRecords, getFullRecord, getTimeRecords } from '../controllers/records';
import { validateData } from '../middlewares/validation';
import {
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetFullRecordZodSchema,
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

export default router;
