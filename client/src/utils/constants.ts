export const queryKeys = {
  conversations: ['conversations'] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
};
