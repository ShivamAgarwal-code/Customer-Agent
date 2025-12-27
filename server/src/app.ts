import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import { ServiceContext } from './services/context.js';
import { openAiIntegration } from './integrations/index.js';
import { conversationRepository } from './repositories/conversation.repository.js';
import { messageRepository } from './repositories/message.repository.js';

export const createApp = (): express.Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    })
  );
  const ctx: ServiceContext = {
    llm: openAiIntegration,
    conversationRepo: conversationRepository,
    messageRepo: messageRepository,
  };
  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);
  app.use((req, res, next) => {
    req.ctx = ctx;
    next();
  });
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "API is running",
    });
  });

  app.use(routes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
