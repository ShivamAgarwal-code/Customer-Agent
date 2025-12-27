import { Message } from '../../generated/prisma/client.js';
export interface LLMIntegration {
  completeChat: (
    promptTemplate: string,
    message: string,
    history?: Message[]
  ) => Promise<string | null>;
}
export default LLMIntegration;
