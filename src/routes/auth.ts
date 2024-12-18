import express from 'express';
import { login, register, simplifiedAuth } from '../controllers/auth';
import { AuthZodSchema } from '../database/Schema';
import { validateData } from '../middlewares/validation';

const router = express.Router();

router.route('/register').post(validateData(AuthZodSchema), register);
router.route('/login').post(validateData(AuthZodSchema), login);
router.route('/').post(validateData(AuthZodSchema), simplifiedAuth);

export default router;
