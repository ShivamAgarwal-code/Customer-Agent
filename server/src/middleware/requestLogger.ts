import { pinoHttp } from 'pino-http';
import { logger } from '../utils/logger.js';
import { randomUUID } from 'node:crypto';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existingId = req.headers['x-request-id'];
    if (typeof existingId === 'string') {
      return existingId;
    }
    return randomUUID();
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}`;
  },
  customProps: (req) => ({
    requestId: req.id,
  }),
});
