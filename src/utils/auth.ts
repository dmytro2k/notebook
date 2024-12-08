import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors';
import config from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(13);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (candidatePassword: string, password: string): Promise<void> => {
  const isMatch = await bcrypt.compare(candidatePassword, password);

  if (!isMatch) {
    throw new BadRequestError('Incorrect password');
  }
};

export const createJWT = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_LIFETIME,
  });
};
