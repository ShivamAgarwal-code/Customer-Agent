import {
  CUSTOMER_SUPPORT_PROMPT,
  GENERATE_CONVERSATION_TITLE_PROMPT,
  GET_REQUEST_TYPE_PROMPT,
} from '../utils/prompts.js';
import {
  DEFAULT_ASSISTANT_RESPONSE,
  DEFAULT_GREETING_RESPONSE,
  MessageRole,
  RequestType,
} from '../utils/constants.js';
import { ServiceContext } from './context.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../errors/AppError.js';
import { Message } from '../generated/prisma/client.js';
const getAgentResponse = async (
  ctx: ServiceContext,
  message: string,
  last10Messages: Message[]
) => {
  const requestTypeResponse = await ctx.llm.completeChat(
    GET_REQUEST_TYPE_PROMPT,
    message,
    last10Messages
  );
  let requestType: RequestType | null = null;
  try {
    const parsed = JSON.parse(requestTypeResponse || '{}');
    const parsedRequestType = parsed?.requestType;
    if (
      parsedRequestType &&
      Object.values(RequestType).includes(parsedRequestType as RequestType)
    ) {
      requestType = parsedRequestType as RequestType;
    }
  } catch (error) {
    logger.warn({ error, requestTypeResponse }, 'Failed to parse request type response');
  }
  let assistantResponse: string = DEFAULT_ASSISTANT_RESPONSE;
  let callLLM = true;
  if (
    requestType === RequestType.Other ||
    requestType === RequestType.PersonalInformation ||
    !requestType
  ) {
    callLLM = false;
  }
  if (requestType === RequestType.Greeting) {
    assistantResponse = DEFAULT_GREETING_RESPONSE;
    callLLM = false;
  }
  if (callLLM) {
    const response = await ctx.llm.completeChat(CUSTOMER_SUPPORT_PROMPT, message, last10Messages);
    if (response) {
      assistantResponse = response;
    }
  }
  return assistantResponse;
};
export const completeChat = async (
  ctx: ServiceContext,
  message: string,
  conversationId?: string
) => {
  try {
    let conversation;
    if (conversationId) {
      conversation = await ctx.conversationRepo.findById(conversationId);
      if (!conversation) {
        throw AppError.notFound(`Conversation with id ${conversationId} not found`);
      }
    } else {
      const title = await ctx.llm.completeChat(GENERATE_CONVERSATION_TITLE_PROMPT, message);
      conversation = await ctx.conversationRepo.create({
        title: title || '',
      });
    }
    const last10Messages = await ctx.messageRepo.findByConversationId(
      conversation.id,
      undefined,
      10
    );
    const [_userMessage, response] = await Promise.all([
      ctx.messageRepo.create({
        content: message,
        role: MessageRole.USER,
        conversationId: conversation.id,
      }),
      getAgentResponse(ctx, message, last10Messages),
    ]);

    if (!response) {
      throw AppError.internal('No response from LLM');
    }
    await ctx.messageRepo.create({
      content: response,
      role: MessageRole.ASSISTANT,
      conversationId: conversation.id,
    });

    return {
      conversationId: conversation.id,
      response,
    };
  } catch (error) {
    logger.error({ error }, 'Error completing chat');
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.internal('Error completing chat');
  }
};

export const getConversationMessages = async (
  ctx: ServiceContext,
  conversationId: string,
  limit: number,
  nextCursor?: string
) => {
  const messages = await ctx.messageRepo.findByConversationId(conversationId, nextCursor, limit);
  const hasMore = !!messages && messages.length === limit;
  const newNextCursor =
    hasMore && messages.length > 0 && messages[messages.length - 1]
      ? messages[messages.length - 1]!.createdAt.toISOString()
      : undefined;
  return {
    messages,
    hasMore,
    nextCursor: newNextCursor,
  };
};

export const getConversations = async (ctx: ServiceContext, limit: number, nextCursor?: string) => {
  const conversations = await ctx.conversationRepo.findAll(limit, nextCursor);
  const hasMore = !!conversations && conversations.length === limit;
  const newNextCursor =
    hasMore && conversations.length > 0 && conversations[conversations.length - 1]
      ? conversations[conversations.length - 1]!.updatedAt.toISOString()
      : undefined;
  return {
    conversations,
    hasMore,
    nextCursor: newNextCursor,
  };
};
