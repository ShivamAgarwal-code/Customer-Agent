import { IConversationRepository } from './interfaces.js';
import { db } from '../integrations/db/index.js';
import { ConversationStatus } from '../utils/constants.js';

export const conversationRepository: IConversationRepository = {
  findById: (id: string) => {
    return db.conversation.findUnique({ where: { id } });
  },

  create: (data: { title: string }) => {
    return db.conversation.create({
      data: { status: ConversationStatus.ACTIVE, title: data.title },
    });
  },

  findAll: (limit: number, nextCursor?: string) => {
    return db.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      where: { ...(nextCursor && { updatedAt: { lt: new Date(nextCursor) } }) },
    });
  },

  delete: async (id: string) => {
    await db.conversation.delete({ where: { id } });
  },

  count: async () => {
    return db.conversation.count();
  },
};
