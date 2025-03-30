import express from 'express';
import { login, register } from '../controllers/auth';
import { AuthZodSchema } from '../types/user';
import { validateData } from '../middlewares/validation';
import { handleRequest } from '../utils/request';
import { checkUserForLogin, checkUserForRegister } from '../middlewares/validateUser';

const router = express.Router();

router.route('/register').post(validateData(AuthZodSchema), checkUserForRegister, handleRequest(register));
router.route('/login').post(validateData(AuthZodSchema), checkUserForLogin, handleRequest(login));

export default router;
