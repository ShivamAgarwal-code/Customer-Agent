import { Request, Response, NextFunction } from 'express';
import { getConversations } from '../services/chat.service.js';
import { createSuccessResponse } from '../utils/apiUtils.js';
import { z } from 'zod';
const listChatRequestQuerySchema = z.object({
  nextCursor: z.string().optional(),
  limit: z.coerce.number().default(10),
});

export default async function listChatController(req: Request, res: Response, next: NextFunction) {
  try {
    const { nextCursor, limit } = listChatRequestQuerySchema.parse(req.query);
    const { ctx } = req;
    const {
      conversations,
      hasMore,
      nextCursor: newNextCursor,
    } = await getConversations(ctx, limit, nextCursor);
    res.status(200).json(
      createSuccessResponse(conversations, 'Conversations fetched successfully', {
        hasMore,
        nextCursor: newNextCursor,
        limit,
      })
    );
  } catch (error) {
    next(error);
  }
}
