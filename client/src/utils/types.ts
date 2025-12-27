// Unified Message type matching API structure
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  conversationId?: string;
  createdAt: string;
}

export type MessageSender = 'user' | 'ai';

export interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'closed';
  createdAt: Date;
  lastUpdated: Date;
}

// API Response Types
export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'closed';
  title: string;
}

export interface PaginationMeta {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export type ConversationsResponse = ApiResponse<Conversation[]>;
export type MessagesResponse = ApiResponse<Message[]>;

export interface ChatCompletionResponse {
  success: boolean;
  data: {
    conversationId: string;
    response: string;
  };
}

// Result types for API functions
export interface ConversationsResult {
  conversations: Conversation[];
  meta: PaginationMeta;
}

export interface MessagesResult {
  messages: Message[];
  meta: PaginationMeta;
}
