import { LLMIntegration } from '../integrations/index.js';
import { IConversationRepository, IMessageRepository } from '../repositories/index.js';

export type ServiceContext = {
  llm: LLMIntegration;
  conversationRepo: IConversationRepository;
  messageRepo: IMessageRepository;
};
