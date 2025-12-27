import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { completeChat } from '../services/chat.service.js';
import { logger } from '../utils/logger.js';
import { createSuccessResponse } from '../utils/apiUtils.js';

const chatRequestBodySchema = z.object({
  message: z
    .string({ required_error: 'Message is required' })
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message cannot exceed 10000 characters'),
});

const chatRequestParamsSchema = z.object({
  conversationId: z.string().optional(),
});

export default async function chatController(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = chatRequestBodySchema.parse(req.body);
    const { conversationId: inputConversationId } = chatRequestParamsSchema.parse(req.params);
    const { ctx } = req;
    const { conversationId, response } = await completeChat(ctx, message, inputConversationId);
    res.status(200).json(createSuccessResponse({ conversationId, response }));
  } catch (error) {
    logger.error({ error }, 'Error completing chat');
    next(error);
  }
}
