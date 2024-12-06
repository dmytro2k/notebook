import { Request, Response, NextFunction } from 'express';
import { ControllerFunctionProps } from '../interfaces';

export const asyncWrapper = (controllerFunction: ControllerFunctionProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
