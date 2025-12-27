import { writable } from "svelte/store";
import type { Message } from "../utils/types";

export const activeConversationId = writable<string | undefined>(undefined)
export const isLoading = writable(false);
export const isTyping = writable(false);
export const isLoadingMessages = writable(false);

export const messages = writable<Message[]>([getWelcomeMessage()]);
export function handleSelectConversation(conversationId: string) {
  activeConversationId.set(conversationId);
}

export function handleNewConversation() {
  activeConversationId.set(undefined);
  messages.set([getWelcomeMessage()]);
}

export function generateMessageId(): string {
  return crypto.randomUUID();
}
export function createMessage(
  content: string,
  role: 'user' | 'assistant' | 'system',
  conversationId?: string
): Message {
  return {
    id: generateMessageId(),
    content,
    role,
    conversationId,
    createdAt: new Date().toISOString()
  };
}
export function getWelcomeMessage(): Message {
  return createMessage('Hello! How can I help you today?', 'assistant');
}

export function setLoadedMessages(loadedMessages: Message[]) {
  messages.set(loadedMessages)
}
export function setNewMessage(message: Message) {
  messages.update((m) => [...m, message])
}
