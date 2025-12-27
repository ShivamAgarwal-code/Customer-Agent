import { ServiceContext } from '../services/context.js';

declare global {
  namespace Express {
    interface Request {
      ctx: ServiceContext;
    }
  }
}
