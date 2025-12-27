import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';
import { isProd } from '../config/index.js';
import { createErrorResponse } from '../utils/apiUtils.js';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(
    {
      err,
      req: {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
      },
    },
    'Request error'
  );
  if (err instanceof ZodError) {
    const response = createErrorResponse<unknown>(
      'Validation failed',
      'VALIDATION_ERROR',
      err.flatten()
    );
    res.status(422).json(response);
    return;
  }
  if (err instanceof AppError) {
    const response = createErrorResponse<unknown>(err.message, err.code);
    res.status(err.statusCode).json(response);
    return;
  }
  const response = createErrorResponse<unknown>(err.message, 'INTERNAL_ERROR');
  res.status(500).json(response);
};
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Route ${req.method} ${req.path} not found`));
};
