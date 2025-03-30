import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export const EmptyZodSchema = z.object({});

export interface TypedRequest<BodyType, ParamsType extends ParamsDictionary, QueryType extends ParsedQs> extends Request {
  body: BodyType;
  params: ParamsType;
  query: QueryType;
}

export type ControllerFunctionProps = (req: Request, res: Response, next: NextFunction) => Promise<void>;
