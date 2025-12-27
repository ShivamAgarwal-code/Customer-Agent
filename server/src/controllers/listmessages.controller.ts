import { Request, Response, NextFunction } from 'express';
import { createSuccessResponse } from '../utils/apiUtils.js';
import { getConversationMessages } from '../services/chat.service.js';
import { z } from 'zod';

const listMessagesRequestParamsSchema = z.object({
  conversationId: z.string(),
});
const listMessagesRequestQuerySchema = z.object({
  nextCursor: z.string().optional(),
  limit: z.coerce.number().default(10),
});
export default async function listMessagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { conversationId } = listMessagesRequestParamsSchema.parse(req.params);
    const { nextCursor, limit } = listMessagesRequestQuerySchema.parse(req.query);
    const { ctx } = req;
    const {
      messages,
      hasMore,
      nextCursor: newNextCursor,
    } = await getConversationMessages(ctx, conversationId, limit, nextCursor);
    res.status(200).json(
      createSuccessResponse(messages, 'Messages fetched successfully', {
        hasMore,
        nextCursor: newNextCursor,
        limit,
      })
    );
  } catch (error) {
    next(error);
  }
}
