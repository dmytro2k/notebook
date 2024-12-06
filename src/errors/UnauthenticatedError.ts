import CustomError from './CustomError';
import { StatusCodes } from 'http-status-codes';

export default class UnauthenticatedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
