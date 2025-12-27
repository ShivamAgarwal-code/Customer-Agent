export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RequestType {
  FAQ = 'FAQ',
  PersonalInformation = 'PersonalInformation',
  Greeting = 'Greeting',
  Other = 'Other',
}

export const DEFAULT_ASSISTANT_RESPONSE =
  'I am sorry, I am not able to answer that question. Please contact our customer support team for assistance.';
export const DEFAULT_GREETING_RESPONSE = 'Hello! How can I help you today?';
