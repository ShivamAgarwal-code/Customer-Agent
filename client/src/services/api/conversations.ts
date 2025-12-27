import type {
  ConversationsResponse,
  MessagesResponse,
  ChatCompletionResponse,
  ConversationsResult,
  MessagesResult
} from '../../utils/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
const API_BASE_URL = PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetch conversations with pagination support
 */
export async function fetchConversations(nextCursor?: string, limit: number = 10): Promise<ConversationsResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (nextCursor) {
    params.append('nextCursor', nextCursor);
  }

  const response = await fetch(`${API_BASE_URL}/chat?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`);
  }

  const result: ConversationsResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch conversations');
  }

  return {
    conversations: result.data,
    meta: result.meta || { limit, hasMore: false, nextCursor: null }
  };
}

/**
 * Fetch messages for a specific conversation with pagination
 */
export type FetchMessageParams = {
  conversationId: string,
  nextCursor?: string,
  limit?: number
}
export async function fetchMessages(inputParams: FetchMessageParams): Promise<MessagesResult> {
  let { conversationId, nextCursor, limit } = inputParams
  if (!limit) limit = 50
  const params = new URLSearchParams({ limit: String(limit) });
  if (nextCursor) {
    params.append('nextCursor', nextCursor);
  }

  const response = await fetch(`${API_BASE_URL}/chat/${conversationId}/messages?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }

  const result: MessagesResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch messages');
  }

  return {
    messages: result.data,
    meta: result.meta || { limit, hasMore: false, nextCursor: null }
  };
}
export type SendMessageInput = {
  message: string,
  conversationId?: string
}
export async function sendMessage(input: SendMessageInput): Promise<{ conversationId: string; response: string }> {
  const { message, conversationId } = input
  const url = conversationId ? `chat/${conversationId}` : 'chat'
  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const result: ChatCompletionResponse = await response.json();

  if (!result.success) {
    throw new Error('Failed to send message');
  }

  return result.data;
}
