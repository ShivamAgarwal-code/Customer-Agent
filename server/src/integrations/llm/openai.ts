import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import LLMIntegration from './interface.js';
import { Message } from '../../generated/prisma/client.js';
import { MessageRole } from '../../utils/constants.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const buildMessages = (
  systemPrompt: string,
  message: string,
  history?: Message[]
): ChatCompletionMessageParam[] => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: MessageRole.SYSTEM,
      content: systemPrompt,
    },
  ];
  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role as MessageRole,
        content: msg.content,
      });
    }
  }
  messages.push({
    role: MessageRole.USER,
    content: message,
  });

  return messages;
};

const openAiIntegration: LLMIntegration = {
  completeChat: async (
    systemPrompt: string,
    message: string,
    history?: Message[]
  ): Promise<string | null> => {
    try {
      const messages = buildMessages(systemPrompt, message, history);

      const response = await openai.chat.completions.create({
        model: config.OPENAI_MODEL,
        messages,
        max_completion_tokens: 500,
      });
      logger.info({ response }, 'OpenAI response');
      const assistantMessage = response.choices[0]?.message?.content;
      logger.info({ assistantMessage }, 'OpenAI response');
      if (!assistantMessage) {
        logger.error({ messages }, 'No response received from OpenAI');
        return null;
      }

      return assistantMessage;
    } catch (error) {
      logger.error({ error }, 'Error completing chat');
      return null;
    }
  },
};

export default openAiIntegration;
