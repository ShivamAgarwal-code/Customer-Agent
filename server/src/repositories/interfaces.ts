import { Conversation } from '../generated/prisma/client.js';

import { Message } from '../generated/prisma/client.js';
import { MessageRole } from '../utils/constants.js';

export interface IConversationRepository {
  findById: (id: string) => Promise<Conversation | null>;
  create: (data: { title: string }) => Promise<Conversation>;
  findAll: (limit: number, nextCursor?: string) => Promise<Conversation[]>;
  delete: (id: string) => Promise<void>;
  count: () => Promise<number>;
}

export interface IMessageRepository {
  create: (data: {
    content: string;
    role: MessageRole;
    conversationId: string;
  }) => Promise<Message>;
  findByConversationId: (
    conversationId: string,
    nextCursor?: string,
    limit?: number
  ) => Promise<Message[]>;
  countByConversationId: (conversationId: string) => Promise<number>;
}
