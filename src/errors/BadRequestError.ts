import CustomError from './CustomError';
import { StatusCodes } from 'http-status-codes';

export default class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
