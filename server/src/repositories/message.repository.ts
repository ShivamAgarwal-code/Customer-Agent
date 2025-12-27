import { IMessageRepository } from './interfaces.js';
import { db } from '../integrations/db/index.js';
import { MessageRole } from '../utils/constants.js';

export const messageRepository: IMessageRepository = {
  create: (data: { content: string; role: MessageRole; conversationId: string }) => {
    return db.message.create({ data });
  },

  findByConversationId: (conversationId: string, nextCursor?: string, limit?: number) => {
    if (!limit) {
      limit = 10;
    }
    return db.message.findMany({
      where: { conversationId, ...(nextCursor && { createdAt: { lt: nextCursor } }) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        conversation: true,
      },
    });
  },

  countByConversationId: (conversationId: string) => {
    return db.message.count({ where: { conversationId } });
  },
};
